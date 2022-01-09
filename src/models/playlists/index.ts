import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { SpotifyService } from '../../services/spotify'
import { YoutubeService } from '../../services/youtube'
import { NotFoundMusic } from '../../utils/errors/NotFoundMusic'
import { NotFoundPlaylist } from '../../utils/errors/NotFoundPlaylist'
import { NotFoundPlaylistItem } from '../../utils/errors/NotFoundPlaylistItem'
import { SongAlreadyPlaylist } from '../../utils/errors/SongAlreadyPlaylist'
import { UnknownError } from '../../utils/errors/UnknownError'
import { MusicsModel } from '../musics'
import { Music } from '../musics/types'
import { Playlist, PlaylistItem } from './types'

const youtubeService = new YoutubeService()
const spotifyService = new SpotifyService()

interface Options {
  musicsModel?: MusicsModel
}

export class PlaylistsModel {
  musicsModel?: MusicsModel

  youtubeService: YoutubeService
  spotifyService: SpotifyService
  constructor(options: Options) {
    this.youtubeService = new YoutubeService()
    this.spotifyService = new SpotifyService()

    this.musicsModel = options.musicsModel
  }

  async get(playlistId: string) {
    return await db<Playlist>('playlists')
      .select()
      .where('id', playlistId)
      .first()
  }

  create(name: string) {
    return new Promise(resolve => {
      const id = uuid()
      db<Playlist>('playlists')
        .insert({
          id,
          name
        })
        .then(() => {
          resolve(id)
          youtubeService
            .createPlaylist(name)
            .then(youtubeId => {
              console.log(youtubeId)
              return db('playlists').where('id', id).update({ youtubeId })
            })
            .catch(console.log)
          spotifyService
            .createPlaylist(name)
            .then(spotifyId => {
              console.log(spotifyId)
              return db('playlists').where('id', id).update({ spotifyId })
            })
            .catch(console.log)
        })
    })
  }

  async list() {
    const playlists = await db<Playlist>('playlists').select()
    return playlists
  }

  async addMusic(playlistId: string, musicId: string) {
    if (!this.musicsModel) throw new UnknownError()
    const music = await this.musicsModel.getOnlyColumns(musicId, [
      'spotifyId',
      'youtubeId'
    ])
    if (!music) throw new NotFoundMusic()

    const playlist = await db<Playlist>('playlists')
      .select('*')
      .where('id', playlistId)
      .first()
    if (!playlist) throw new NotFoundPlaylist()

    const playlistsItemsRows = await db<PlaylistItem>('musics_playlists')
      .select('*')
      .where('playlistId', playlistId)
    const exists = playlistsItemsRows.findIndex(row => row.musicId === musicId)
    if (exists !== -1) throw new SongAlreadyPlaylist()

    await db<PlaylistItem>('musics_playlists').insert({
      position: playlistsItemsRows.length,
      musicId,
      playlistId,
      ytSync: false,
      spotifySync: false
    })

    if (playlist.spotifyId) {
      spotifyService
        .addToPlaylist(playlist.spotifyId, music.spotifyId)
        .then(() => {
          return db('musics_playlists')
            .update({
              spotifySync: true
            })
            .where('playlistId', playlistId)
            .where('musicId', musicId)
        })
        .then()
    }

    if (playlist.youtubeId) {
      youtubeService
        .addToPlaylist(playlist.youtubeId, music.youtubeId)
        .then(youtubePlaylistItemId => {
          return db('musics_playlists')
            .update({
              youtubePlaylistItemId,
              ytSync: true
            })
            .where('playlistId', playlistId)
            .where('musicId', musicId)
        })
    }
  }

  async rearrange(newPosition: number, playlistId: string, musicId: string) {
    if (!this.musicsModel) throw new UnknownError()
    const playlistMusicList = await db<PlaylistItem>('musics_playlists')
      .select('*')
      .where('playlistId', playlistId)
      .orderBy('position', 'asc')
    const actualPlaylistItem = playlistMusicList.find(
      music => music.musicId === musicId
    )
    if (!actualPlaylistItem) throw new NotFoundPlaylistItem()

    const playlist = await db<Pick<Playlist, 'spotifyId' | 'youtubeId'>>(
      'playlists'
    )
      .select(['spotifyId', 'youtubeId'])
      .where('id', playlistId)
      .first()
    if (!playlist) throw new NotFoundPlaylist()

    const music = await this.musicsModel.getOnlyColumns(musicId, ['youtubeId'])
    if (!music) throw new NotFoundMusic()

    const newPlaylists = playlistMusicList.filter(music => {
      return music.musicId !== musicId
    })
    newPlaylists.splice(newPosition, 0, {
      playlistId,
      musicId,
      position: newPosition,
      spotifySync: false,
      ytSync: false
    })

    await Promise.all(
      newPlaylists.map(async (music, index) => {
        await db('musics_playlists')
          .update({ position: index })
          .where('musicId', music.musicId)
          .where('playlistId', music.playlistId)
      })
    )
    if (playlist.spotifyId) {
      spotifyService
        .rearrange(playlist.spotifyId, actualPlaylistItem.position, newPosition)
        .then(() => {
          return db<PlaylistItem>('musics_playlists')
            .where('musicId', musicId)
            .where('playlistId', playlistId)
            .update({
              spotifySync: true
            })
        })
        .then()
    }
    if (actualPlaylistItem.youtubePlaylistItemId && playlist.youtubeId) {
      youtubeService
        .rearrange(
          playlist.youtubeId,
          actualPlaylistItem.youtubePlaylistItemId,
          music.youtubeId,
          newPosition
        )
        .then(() => {
          return db<PlaylistItem>('musics_playlists')
            .where('musicId', musicId)
            .where('playlistId', playlistId)
            .update({
              ytSync: true
            })
        })
        .then()
    }
  }

  async removeMusic(playlistId: string, musicId: string) {
    const listOfMusics = await db<PlaylistItem>('musics_playlists')
      .select('*')
      .where('playlistId', playlistId)
      .orderBy('position', 'asc')
    const musicInPlaylist = listOfMusics.find(item => item.musicId === musicId)
    if (!musicInPlaylist) throw new NotFoundPlaylistItem()

    const music = await db<Pick<Music, 'youtubeId' | 'spotifyId'>>('musics')
      .select(['youtubeId', 'spotifyId'])
      .where('id', musicId)
      .first()
    if (!music) throw new NotFoundMusic()

    const playlist = await db<Pick<Playlist, 'spotifyId'>>('playlists')
      .select('spotifyId')
      .where('id', playlistId)
      .first()
    if (!playlist) throw new NotFoundPlaylist()

    const trx = await db.transaction()
    await trx('musics_playlists')
      .where('musicId', musicId)
      .where('playlistId', playlistId)
      .delete()

    const newPlaylist = listOfMusics.filter(item => item.musicId !== musicId)
    const promises = newPlaylist.map(async (item, index) => {
      await trx<PlaylistItem>('musics_playlists')
        .update({ position: index })
        .where('musicId', item.musicId)
        .where('playlistId', item.playlistId)
    })
    await Promise.all(promises)
    await trx.commit()

    if (playlist?.spotifyId)
      spotifyService.deleteItem(playlist.spotifyId, music.spotifyId)
    if (musicInPlaylist.youtubePlaylistItemId)
      youtubeService.deleteItem(musicInPlaylist.youtubePlaylistItemId)
  }

  async delete(playlistId: string) {
    const playlist = await db<Pick<Playlist, 'spotifyId' | 'youtubeId'>>(
      'playlists'
    )
      .select()
      .where('id', playlistId)
      .first()
    if (!playlist) throw new NotFoundPlaylist()

    await db('playlists').delete().where('id', playlistId)

    if (playlist.youtubeId) {
      this.youtubeService
        .deletePlaylist(playlist.youtubeId)
        .then(() => {})
        .catch(() => {})
    }

    if (playlist.spotifyId) {
      this.spotifyService
        .deletePlaylist(playlist.spotifyId)
        .then(() => {})
        .catch(() => {})
    }
  }

  async exists(playlistId: string) {
    const result = await db('playlists').select('*').where('id', playlistId)
    return result.length === 1
  }
}
