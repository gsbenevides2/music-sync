import { Credentials, OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import ytMusic from 'node-youtube-music'
import { MusicVideo } from 'node-youtube-music/dist/src/models'

import { db } from '../../database/db'
import { decrypt, encrypt } from '../../utils/cripto'
import { removeSpecialCaractersAndSpaces } from '../../utils/removeSpecialCaractersAndSpaces'

const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URL } =
  process.env

/** This function returns the YouTube song id or possible results. */
export async function getMusic(
  name: string,
  artist: string,
  album: string
): Promise<string | MusicVideo[]> {
  const ytResults = await ytMusic.searchMusics(`${name} ${name}`)
  const { youtubeId = null } =
    ytResults.filter(ytResult => {
      const artistTest =
        removeSpecialCaractersAndSpaces(ytResult.artist as string) ===
        removeSpecialCaractersAndSpaces(artist)
      const albumTest =
        removeSpecialCaractersAndSpaces(ytResult.album as string) ===
        removeSpecialCaractersAndSpaces(album)
      const nameTest =
        removeSpecialCaractersAndSpaces(ytResult.title as string) ===
        removeSpecialCaractersAndSpaces(name)
      return artistTest && albumTest && nameTest
    })[0] || {}
  return youtubeId || ytResults
}

export function getAuthUrl(): string {
  const oauthClient = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URL
  )
  const scopes = ['https://www.googleapis.com/auth/youtube']
  const authUrl = oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })
  return authUrl
}

const tokenKeys: (keyof Credentials)[] = [
  'access_token',
  'expiry_date',
  'id_token',
  'refresh_token',
  'scope',
  'token_type'
]
export async function saveToken(token: Credentials) {
  const rows = await db('configs')
    .select('*')
    .where('name', 'LIKE', '%googleToken%')
  if (rows.length === 0) {
    await db('configs').insert(
      tokenKeys.map(key => {
        let data = token[key] as string
        let data2 = null
        if (key === 'access_token' || key === 'refresh_token') {
          data = encrypt(data)
          data2 = data.slice(255)
          data = data.slice(0, 255)
        }
        return { name: `googleToken-${key}`, value: data, value2: data2 }
      })
    )
  } else {
    await db('configs').delete().where('name', 'LIKE', '%googleToken%')
    await db('configs').insert(
      tokenKeys.map(key => {
        let data = token[key] as string
        let data2 = null
        if (key === 'access_token' || key === 'refresh_token') {
          data = encrypt(data)
          data2 = data.slice(255)
          data = data.slice(0, 255)
        }
        return { name: `googleToken${key}`, value: data, value2: data2 }
      })
    )
  }
}

export async function getNewToken(code: string) {
  const oauthClient = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URL
  )
  const { tokens } = await oauthClient.getToken(code)
  return tokens
}

async function authenticate(): Promise<OAuth2Client> {
  const oauthClient = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URL
  )
  oauthClient.on('tokens', saveToken)
  const rows = await db('configs')
    .select('*')
    .where('name', 'LIKE', '%googleToken%')
  const token: Credentials = Object.fromEntries(
    rows.map(row => {
      const key = tokenKeys.find(key => row.name.includes(key))
      let value = row.value
      if (key === 'access_token' || key === 'refresh_token') {
        value = decrypt(`${value}${row.value2}`)
      }
      return [key, value]
    })
  )
  oauthClient.setCredentials(token)
  return oauthClient
}

export async function createPlaylist(name: string): Promise<string> {
  const auth = await authenticate()
  const ytApi = google.youtube({
    version: 'v3',
    auth
  })
  const result = await ytApi.playlists.insert({
    part: ['id', 'snippet'],
    requestBody: {
      snippet: { title: name }
    }
  })
  return result.data.id as string
}

export async function addToPlaylist(playlistId: string, musicId: string) {
  const auth = await authenticate()
  const ytApi = google.youtube({
    version: 'v3',
    auth
  })
  const result = await ytApi.playlistItems.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId: musicId
        }
      }
    }
  })
  return result.data.id as string
}

export async function rearrange(
  playlistId: string,
  youtubePlaylistItemId: string,
  musicId: string,
  position: number
) {
  const auth = await authenticate()
  const ytApi = google.youtube({
    version: 'v3',
    auth
  })
  await ytApi.playlistItems.update({
    part: ['snippet'],
    requestBody: {
      id: youtubePlaylistItemId,
      snippet: {
        playlistId,
        position,
        resourceId: {
          kind: 'youtube#video',
          videoId: musicId
        }
      }
    }
  })
}

export async function deleteItem(youtubePlaylistItemId: string) {
  const auth = await authenticate()
  const ytApi = google.youtube({
    version: 'v3',
    auth
  })
  await ytApi.playlistItems.delete({
    id: youtubePlaylistItemId
  })
}
