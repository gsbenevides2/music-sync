import { Credentials } from 'google-auth-library'
import { google } from 'googleapis'
import ytMusic from 'node-youtube-music'
import { MusicVideo } from 'node-youtube-music/dist/src/models'
import { v4 as uuid } from 'uuid'
import ytdl from 'ytdl-core'

import { db } from '../../database/db'
import { decrypt, encrypt } from '../../utils/cripto'
import { YoutubeLoginInvalid } from '../../utils/errors/YoutubeLoginInvalid'
import { YoutubeNotLinked } from '../../utils/errors/YoutubeNotLinked'
import { YoutubeSecureIdInvalid } from '../../utils/errors/YoutubeSecureIdInvalid'
import { removeSpecialCaractersAndSpaces } from '../../utils/removeSpecialCaractersAndSpaces'

interface Config {
  name: string
  value1?: string
  value2?: string
}

const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, WEB_CLIENT_HOST } =
  process.env

const YOUTUBE_REDIRECT_URL = WEB_CLIENT_HOST + '/youtubeAuth/callback'

export class YoutubeService {
  private oauthClient = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URL
  )

  private tokenKeys: (keyof Required<Credentials>)[] = [
    'access_token',
    'expiry_date',
    'id_token',
    'refresh_token',
    'scope',
    'token_type'
  ]

  async getMusic(
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

  async getAuthUrl() {
    let youTubeSafeLoginID = ''
    const row = await db<Config>('configs')
      .select('*')
      .where('name', 'youTubeSafeLoginID')
      .first()
    if (row?.value1) youTubeSafeLoginID = row.value1
    else {
      youTubeSafeLoginID = uuid()
      await db<Config>('configs').insert({
        name: 'youTubeSafeLoginID',
        value1: youTubeSafeLoginID
      })
    }
    const scopes = ['https://www.googleapis.com/auth/youtube']
    const authUrl = this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: youTubeSafeLoginID
    })
    return authUrl
  }

  private get ytApi() {
    return google.youtube({
      version: 'v3',
      auth: this.oauthClient
    })
  }

  getAndSaveTokenFromCodeAndSecurityID(code: string, securityId: string) {
    return new Promise((resolve, reject) => {
      db<Config>('configs')
        .select('*')
        .where('name', 'youTubeSafeLoginID')
        .first()
        .then(config => {
          if (config?.value1 === securityId) {
            return db<Config>('configs')
              .delete()
              .where('name', 'youTubeSafeLoginID')
          } else {
            throw new YoutubeSecureIdInvalid()
          }
        })
        .then(() => {
          return this.oauthClient.getToken(code)
        })
        .then(response => {
          return this.saveToken(response.tokens)
        })
        .then(resolve)
        .catch(error => {
          if (error.message.includes('invalid_grant'))
            reject(new YoutubeLoginInvalid())
          else reject(error)
        })
    })
  }

  private async saveToken(tokenToSave: Credentials) {
    const tokenKeys = this.tokenKeys
    async function addTokenToDb() {
      await db<Config>('configs').insert(
        tokenKeys.map(key => {
          let value1 = tokenToSave[key] as string
          let value2
          if (key === 'access_token' || key === 'refresh_token') {
            const encryptedToken = encrypt(value1)
            value1 = encryptedToken.slice(0, 255)
            value2 = encryptedToken.slice(255)
          }
          return {
            name: `youtubeToken-${key}`,
            value1,
            value2
          }
        })
      )
    }
    const rows = await db<Config>('configs')
      .select('*')
      .where('name', 'LIKE', '%youtubeToken%')
    if (rows.length) {
      await db('configs').delete().where('name', 'LIKE', '%youtubeToken%')
    }
    await addTokenToDb()
  }

  private async authenticate() {
    this.oauthClient.on('tokens', token => this.saveToken)
    const rows = await db<Config>('configs')
      .select('*')
      .where('name', 'LIKE', '%youtubeToken%')
    if (rows.length) {
      const token: Credentials = Object.fromEntries(
        rows.map(row => {
          const key = this.tokenKeys.find(key => row.name.includes(key))
          let value = row.value1
          if (key === 'access_token' || key === 'refresh_token') {
            value = decrypt(`${value}${row.value2}`)
          }
          return [key, value]
        })
      )
      this.oauthClient.setCredentials(token)
    } else {
      throw new YoutubeNotLinked()
    }
  }

  async createPlaylist(name: string): Promise<string> {
    await this.authenticate()

    const result = await this.ytApi.playlists.insert({
      part: ['id', 'snippet'],
      requestBody: {
        snippet: { title: name }
      }
    })
    return result.data.id as string
  }

  async addToPlaylist(playlistId: string, musicId: string) {
    await this.authenticate()

    const result = await this.ytApi.playlistItems.insert({
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

  async rearrange(
    playlistId: string,
    youtubePlaylistItemId: string,
    musicId: string,
    position: number
  ) {
    await this.authenticate()

    await this.ytApi.playlistItems.update({
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

  async deleteItem(youtubePlaylistItemId: string) {
    await this.authenticate()

    await this.ytApi.playlistItems.delete({
      id: youtubePlaylistItemId
    })
  }

  isAuthenticated() {
    return new Promise(resolve => {
      this.authenticate()
        .then(() => {
          return this.ytApi.playlists.list({ part: ['snippet'], id: ['me'] })
        })
        .then(result => {
          if (result.status === 200) resolve(true)
          else resolve(false)
        })
        .catch(e => {
          resolve(false)
        })
    })
  }

  async deletePlaylist(ytPlaylistId: string) {
    await this.authenticate()

    await this.ytApi.playlists.delete({ id: ytPlaylistId })
  }

  verifyYoutubeVideo(videoId: string) {
    return new Promise<boolean>(resolve => {
      const link = this.getLinkFromId(videoId)
      ytdl
        .getInfo(link)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  getLinkFromId(videoId: string) {
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  getIdFromLink(videoLink: string) {
    return ytdl.getVideoID(videoLink)
  }
}
