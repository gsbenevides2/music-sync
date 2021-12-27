import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { SpotifyService } from '../../services/spotify'
import { YoutubeService } from '../../services/youtube'
import { MusicsModel } from '../musics'
import { NotFoundMusic } from '../musics/errors'
import { Music } from '../musics/types'
import {
  PlaylistItemNotFound,
  PlaylistNotFound,
  SongAlreadyPlaylist
} from './errors'
import { Playlist, PlaylistItem } from './types'

const musicsModel = new MusicsModel()
const youtubeService = new YoutubeService()
const spotifyService = new SpotifyService()

export class PlaylistsModel {
  async create(name: string) {
    const youtubeId = await youtubeService.createPlaylist(name)
    const spotifyId = await spotifyService.createPlaylist(name)
    const id = uuid()

    await db('playlists').insert({
      id,
      name,
      youtubeId,
      spotifyId
    })
    return id
  }

  async addMusic(playlistId: string, musicId: string) {
    const music = await musicsModel.getOnlyColumns(musicId, [
      'spotifyId',
      'youtubeId'
    ])
    if (!music) throw new NotFoundMusic()

    const playlist = await db<Playlist>('playlists')
      .select('*')
      .where('id', playlistId)
      .first()
    if (!playlist) throw new PlaylistNotFound()

    const playlistsItemsRows = await db<PlaylistItem>('musics_playlists')
      .select('*')
      .where('playlistId', playlistId)
    const exists = playlistsItemsRows.findIndex(row => row.musicId === musicId)
    if (exists !== -1) throw new SongAlreadyPlaylist()

    await spotifyService.addToPlaylist(playlist.spotifyId, music.spotifyId)
    const youtubeId = await youtubeService.addToPlaylist(
      playlist.youtubeId,
      music.youtubeId
    )

    await db<PlaylistItem>('musics_playlists').insert({
      position: playlistsItemsRows.length,
      musicId,
      playlistId,
      youtubeId
    })
  }

  async rearrange(newPosition: number, playlistId: string, musicId: string) {
    const playlistMusicList = await db('musics_playlists')
      .select('*')
      .where('playlistId', playlistId)
      .orderBy('position', 'asc')
    const actualPlaylistItem = playlistMusicList.find(
      music => music.musicId === musicId
    )
    if (!actualPlaylistItem) throw new PlaylistItemNotFound()

    const playlist = await db<Playlist>('playlists')
      .select(['spotifyId', 'youtubeId'])
      .where('id', playlistId)
      .first()
    if (!playlist) throw new PlaylistNotFound()

    const music = await musicsModel.getOnlyColumns(musicId, ['youtubeId'])
    if (!music) throw new NotFoundMusic()

    const newPlaylists = playlistMusicList.filter(music => {
      return music.musicId !== musicId
    })
    newPlaylists.splice(newPosition, 0, { playlistId, musicId })

    await spotifyService.rearrange(
      playlist.spotifyId,
      actualPlaylistItem.position,
      newPosition
    )
    await youtubeService.rearrange(
      playlist.youtubeId,
      actualPlaylistItem.youtubeId,
      music.youtubeId,
      newPosition
    )

    await Promise.all(
      newPlaylists.map(async (music, index) => {
        await db('musics_playlists')
          .update({ position: index })
          .where('musicId', music.musicId)
          .where('playlistId', music.playlistId)
      })
    )
  }

  async removeMusic(playlistId: string, musicId: string) {
    const listOfMusics = (await db('musics_playlists')
      .select('*')
      .where('playlistId', playlistId)
      .orderBy('position', 'asc')) as PlaylistItem[]
    const musicInPlaylist = listOfMusics.find(item => item.musicId === musicId)
    if (!musicInPlaylist) throw new PlaylistItemNotFound()

    const [music] = (await db('musics')
      .select(['youtubeId', 'spotifyId'])
      .where('id', musicId)) as Pick<Music, 'youtubeId' | 'spotifyId'>[]
    const [playlist] = (await db('playlists')
      .select('spotifyId')
      .where('id', playlistId)) as Pick<Playlist, 'spotifyId'>[]

    await spotifyService.deleteItem(playlist.spotifyId, music.spotifyId)
    await youtubeService.deleteItem(musicInPlaylist.youtubeId)

    const trx = await db.transaction()
    await trx('musics_playlists')
      .where('musicId', musicId)
      .where('playlistId', playlistId)
      .delete()

    const newPlaylist = listOfMusics.filter(item => item.musicId !== musicId)
    const promises = newPlaylist.map(async (item, index) => {
      await trx('musics_playlists')
        .update({ position: index })
        .where('musicId', item.musicId)
        .where('playlistId', item.playlistId)
    })
    await Promise.all(promises)
    await trx.commit()
  }
}
