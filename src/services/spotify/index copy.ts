/* eslint-disable camelcase */
import { getData } from 'spotify-url-info'
import SpotifyWebApi from 'spotify-web-api-node'

import { db } from '../../database/db'
import { decrypt, encrypt } from '../../utils/cripto'

interface AuthorizationCodeGrantResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL } =
  process.env

interface MusicData {
  name: string
  id: string
  discNumber: number
  trackNumber: number
  artist: {
    id: string
    name: string
    coverUrl: string
    genre: string
  }
  album: {
    id: string
    name: string
    coverUrl: string
    year: number
  }
}

export async function getMusicData(link: string): Promise<MusicData> {
  const result = await getData(link)

  const album = {
    id: result.album.id,
    name: result.album.name,
    coverUrl: result.album.images[0].url,
    year: result.album.release_date.split('-')[0]
  }
  const artistResult = await getData(
    `https://open.spotify.com/artist/${result.artists[0].id}`
  )

  const artist = {
    id: artistResult.id,
    name: artistResult.name,
    coverUrl: artistResult.images[0].url,
    genre: artistResult.genres[0]
  }

  return {
    id: result.id,
    name: result.name,
    trackNumber: result.track_number,
    discNumber: result.disc_number,
    artist,
    album
  }
}

export function getAuthUrl(): string {
  const spotifyWebApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL
  })
  const scopes = ['playlist-modify-private', 'playlist-modify-public']
  const authUrl = spotifyWebApi.createAuthorizeURL(scopes, '')
  return authUrl
}

const tokenKeys: (keyof AuthorizationCodeGrantResponse)[] = [
  'access_token',
  'expires_in',
  'refresh_token',
  'scope',
  'token_type'
]

export async function getNewToken(code: string) {
  const spotifyWebApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL
  })
  const { body: tokens } = await spotifyWebApi.authorizationCodeGrant(code)
  return tokens
}

export async function saveToken(token: AuthorizationCodeGrantResponse) {
  const rows = await db('configs')
    .select('*')
    .where('name', 'LIKE', '%spotifyToken%')
  const keys = Object.keys(token)
  if (rows.length === 0) {
    await db('configs').insert(
      keys.map(key => {
        let data = token[key as keyof AuthorizationCodeGrantResponse] as string
        let data2 = null
        if (key === 'access_token' || key === 'refresh_token') {
          data = encrypt(data)
          data2 = data.slice(255)
          data = data.slice(0, 255)
        }
        return { name: `spotifyToken-${key}`, value: data, value2: data2 }
      })
    )
  } else {
    await db('configs').delete().where('name', 'LIKE', '%spotifyToken%')
    await db('configs').insert(
      keys.map(key => {
        let data = token[key as keyof AuthorizationCodeGrantResponse] as string
        let data2 = null
        if (key === 'access_token' || key === 'refresh_token') {
          data = encrypt(data)
          data2 = data.slice(255)
          data = data.slice(0, 255)
        }
        return { name: `spotifyToken-${key}`, value: data, value2: data2 }
      })
    )
  }
}

async function authenticate(): Promise<SpotifyWebApi> {
  const spotifyWebApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL
  })

  const rows = await db('configs')
    .select('*')
    .where('name', 'LIKE', '%spotifyToken%')
  const token: AuthorizationCodeGrantResponse = Object.fromEntries(
    rows.map(row => {
      const key = tokenKeys.find(key => row.name.includes(key))
      let value = row.value
      if (key === 'access_token' || key === 'refresh_token') {
        value = decrypt(`${value}${row.value2}`)
      }
      return [key, value]
    })
  )
  spotifyWebApi.setAccessToken(token.access_token)
  spotifyWebApi.setRefreshToken(token.refresh_token)
  return spotifyWebApi
}

export async function createPlaylist(name: string): Promise<string> {
  const spotifyWebApi = await authenticate()
  const result = await spotifyWebApi.createPlaylist(name)
  // const { body: token } = await spotifyWebApi.refreshAccessToken()
  // await saveToken(token as AuthorizationCodeGrantResponse)
  return result.body.id
}

export async function addToPlaylist(playlistId: string, musicId: string) {
  const spotifyWebApi = await authenticate()
  await spotifyWebApi.addTracksToPlaylist(playlistId, [
    `spotify:track:${musicId}`
  ])
  // const { body: token } = await spotifyWebApi.refreshAccessToken()
  // await saveToken(token as AuthorizationCodeGrantResponse)
}

export async function rearrange(
  playlistId: string,
  oldPositon: number,
  position: number
) {
  const spotifyWebApi = await authenticate()
  await spotifyWebApi.reorderTracksInPlaylist(playlistId, oldPositon, position)
}

export async function deleteItem(playlistId: string, musicId: string) {
  const spotifyWebApi = await authenticate()
  await spotifyWebApi.removeTracksFromPlaylist(playlistId, [
    { uri: `spotify:track:${musicId}` }
  ])
}
