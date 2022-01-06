/* eslint-disable camelcase */
import { getData } from 'spotify-url-info'
import SpotifyWebApi from 'spotify-web-api-node'
import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { decrypt, encrypt } from '../../utils/cripto'
import {
  SpotifyNotLinked,
  SpotifySecureIdInvalid,
  SpotifyUnknownError
} from './errors'

interface AuthorizationCodeGrantResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, WEB_CLIENT_HOST } =
  process.env

const SPOTIFY_REDIRECT_URL = WEB_CLIENT_HOST + '/spotifyAuth/callback'

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
    if (rows.length) {
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
    } else {
      throw new SpotifyNotLinked()
    }
  }

  private async clearToekns() {
    await db('configs').delete().where('name', 'LIKE', '%spotifyToken%')
  }

  createPlaylist(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authenticate()
        .then(() => {
          return this.spotifyWebApi.createPlaylist(name)
        })
        .then(result => {
          resolve(result.body.id)
        })
        .catch(error => {
          if (error?.body?.error?.message === 'The access token expired') {
            this.clearToekns()
            reject(new SpotifyNotLinked())
          } else reject(new SpotifyUnknownError())
        })
    })
  }

  addToPlaylist(playlistId: string, musicId: string) {
    return new Promise<void>((resolve, reject) => {
      this.authenticate()
        .then(() => {
          return this.spotifyWebApi.addTracksToPlaylist(playlistId, [
            `spotify:track:${musicId}`
          ])
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          if (error?.body?.error?.message === 'The access token expired') {
            this.clearToekns()
            reject(new SpotifyNotLinked())
          } else reject(new SpotifyUnknownError())
        })
    })
  }

  rearrange(playlistId: string, oldPositon: number, position: number) {
    return new Promise<void>((resolve, reject) => {
      this.authenticate()
        .then(() => {
          return this.spotifyWebApi.reorderTracksInPlaylist(
            playlistId,
            oldPositon,
            position
          )
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          if (error?.body?.error?.message === 'The access token expired') {
            this.clearToekns()
            reject(new SpotifyNotLinked())
          } else reject(new SpotifyUnknownError())
        })
    })
  }

  deleteItem(playlistId: string, musicId: string) {
    return new Promise<void>((resolve, reject) => {
      this.authenticate()
        .then(() => {
          return this.spotifyWebApi.removeTracksFromPlaylist(playlistId, [
            { uri: `spotify:track:${musicId}` }
          ])
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          if (error?.body?.error?.message === 'The access token expired') {
            this.clearToekns()
            reject(new SpotifyNotLinked())
          } else reject(new SpotifyUnknownError())
        })
    })
  }

  isAuthenticated() {
    return new Promise<boolean>(resolve => {
      this.authenticate()
        .then(() => {
          return this.spotifyWebApi.getMe()
        })
        .then(result => {
          if (result.body.display_name) resolve(true)
          else resolve(false)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  deletePlaylist(spotifyPlaylistId: string) {
    return new Promise<void>((resolve, reject) => {
      this.authenticate().then(() => {
        this.spotifyWebApi
          .unfollowPlaylist(spotifyPlaylistId)
          .then(() => {
            resolve()
          })
          .catch(error => {
            if (error?.body?.error?.message === 'The access token expired') {
              this.clearToekns()
              reject(new SpotifyNotLinked())
            } else reject(new SpotifyUnknownError())
          })
      })
    })
  }
}
