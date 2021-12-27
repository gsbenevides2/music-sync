/* eslint-disable camelcase */
import { getData } from 'spotify-url-info'
import SpotifyWebApi from 'spotify-web-api-node'
import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { decrypt, encrypt } from '../../utils/cripto'
import { SpotifySecureIdInvalid } from './errors'

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
interface Config {
  name: string
  value1?: string
  value2?: string
}

export class SpotifyService {
  private tokenKeys: (keyof AuthorizationCodeGrantResponse)[] = [
    'access_token',
    'expires_in',
    'refresh_token',
    'scope',
    'token_type'
  ]

  private spotifyWebApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL
  })

  async getMusicData(link: string): Promise<MusicData> {
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
      coverUrl: artistResult.images?.[0]?.url || '',
      genre: artistResult.genres[0] || ''
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

  async getAuthUrl(): Promise<string> {
    let spotifySafeLoginID = ''
    const row = await db<Config>('configs')
      .select('*')
      .where('name', 'spotifySafeLoginID')
      .first()
    if (row?.value1) spotifySafeLoginID = row.value1
    else {
      spotifySafeLoginID = uuid()

      await db<Config>('configs').insert({
        name: 'spotifySafeLoginID',
        value1: spotifySafeLoginID
      })
    }
    const scopes = ['playlist-modify-private', 'playlist-modify-public']
    const authUrl = this.spotifyWebApi.createAuthorizeURL(
      scopes,
      spotifySafeLoginID
    )
    return authUrl
  }

  async getNewToken(code: string, spotifySafeLoginID: string) {
    return new Promise((resolve, reject) => {
      db<Config>('configs')
        .select('*')
        .where('name', 'spotifySafeLoginID')
        .first()
        .then(row => {
          if (row?.value1 === spotifySafeLoginID)
            return db<Config>('configs')
              .delete()
              .where('name', 'spotifySafeLoginID')
          else throw new SpotifySecureIdInvalid()
        })
        .then(() => {
          return this.spotifyWebApi.authorizationCodeGrant(code)
        })
        .then(response => {
          return this.saveToken(response.body)
        })
        .then(resolve)
        .catch(error => {
          reject(error)
        })
    })
  }

  private async saveToken(token: AuthorizationCodeGrantResponse) {
    const keys = Object.keys(token)
    async function insertTokensInDb() {
      await db('configs').insert(
        keys.map(key => {
          let value1 = token[
            key as keyof AuthorizationCodeGrantResponse
          ] as string
          let value2
          if (key === 'access_token' || key === 'refresh_token') {
            const encryptedToken = encrypt(value1)
            value2 = encryptedToken.slice(255)
            value1 = encryptedToken.slice(0, 255)
          }
          return { name: `spotifyToken-${key}`, value1, value2 }
        })
      )
    }
    const rows = await db('configs')
      .select('*')
      .where('name', 'LIKE', '%spotifyToken%')

    if (rows.length === 0) {
      await insertTokensInDb()
    } else {
      await db('configs').delete().where('name', 'LIKE', '%spotifyToken%')
      await insertTokensInDb()
    }
  }

  private async authenticate() {
    const rows = await db<Config>('configs')
      .select('*')
      .where('name', 'LIKE', '%spotifyToken%')
    const token: AuthorizationCodeGrantResponse = Object.fromEntries(
      rows.map(row => {
        const key = this.tokenKeys.find(key => row.name.includes(key))
        let value = row.value1
        if (key === 'access_token' || key === 'refresh_token') {
          value = decrypt(`${value}${row.value2}`)
        }
        return [key, value]
      })
    )
    this.spotifyWebApi.setAccessToken(token.access_token)
    this.spotifyWebApi.setRefreshToken(token.refresh_token)
  }

  async createPlaylist(name: string): Promise<string> {
    await this.authenticate()
    const result = await this.spotifyWebApi.createPlaylist(name)
    // const { body: token } = await spotifyWebApi.refreshAccessToken()
    // await saveToken(token as AuthorizationCodeGrantResponse)
    return result.body.id
  }

  async addToPlaylist(playlistId: string, musicId: string) {
    await this.authenticate()
    await this.spotifyWebApi.addTracksToPlaylist(playlistId, [
      `spotify:track:${musicId}`
    ])
    // const { body: token } = await spotifyWebApi.refreshAccessToken()
    // await saveToken(token as AuthorizationCodeGrantResponse)
  }

  async rearrange(playlistId: string, oldPositon: number, position: number) {
    await this.authenticate()
    await this.spotifyWebApi.reorderTracksInPlaylist(
      playlistId,
      oldPositon,
      position
    )
  }

  async deleteItem(playlistId: string, musicId: string) {
    await this.authenticate()
    await this.spotifyWebApi.removeTracksFromPlaylist(playlistId, [
      { uri: `spotify:track:${musicId}` }
    ])
  }
}
