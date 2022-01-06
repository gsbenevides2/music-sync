import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { SpotifyService } from '../../services/spotify'
import { YoutubeService } from '../../services/youtube'
import { AlbumsModel } from '../albums'
import { ArtistsModel } from '../artists'
import { PlaylistsModel } from '../playlists'
import { PlaylistItem } from '../playlists/types'
import {
  AlbumNotExists,
  ArtistNotExists,
  MusicAlreadyExists,
  NotFoundMusic,
  SelectYoutubeMusic
} from './errors'
import { Music } from './types'
import { useOptionalData } from './utils'

interface Options {
  artistsModel?: ArtistsModel
  albumsModel?: AlbumsModel
  playlistModel?: PlaylistsModel
}

export class MusicsModel {
  artistsModel?: ArtistsModel
  albumsModel?: AlbumsModel
  playlistModel?: PlaylistsModel

  spotifyService: SpotifyService
  youtubeService: YoutubeService

  constructor(options: Options) {
    this.spotifyService = new SpotifyService()
    this.youtubeService = new YoutubeService()

    this.artistsModel = options.artistsModel
    this.albumsModel = options.albumsModel
    this.playlistModel = options.playlistModel
  }

  async create(spotifyLink: string, useYoutubeId?: string) {
    if (!this.artistsModel) throw new Error('Invalid Artist Model')
    if (!this.albumsModel) throw new Error('Invalid Album Model')

    const spotifyMusicData = await this.spotifyService.getMusicData(spotifyLink)

    const rowsAlreadyExists = await db<Pick<Music, 'id'>>('musics')
      .select('id')
      .where('spotifyId', spotifyMusicData.id)
    if (rowsAlreadyExists.length)
      throw new MusicAlreadyExists(rowsAlreadyExists[0].id)

    const youtubeData = await this.youtubeService.getMusic(
      spotifyMusicData.name,
      spotifyMusicData.artist.name,
      spotifyMusicData.album.name
    )

    let youtubeId: string
    if (useYoutubeId) {
      youtubeId = useYoutubeId
    } else if (typeof youtubeData === 'string') {
      youtubeId = youtubeData
    } else throw new SelectYoutubeMusic(youtubeData)

    let artistTableId
    const artistInDb = await this.artistsModel.findBySpotifyIdReturnOnlyId(
      spotifyMusicData.artist.id
    )
    if (artistInDb.length) {
      artistTableId = artistInDb[0].id
    } else {
      artistTableId = await this.artistsModel.create({
        name: spotifyMusicData.artist.name,
        spotifyId: spotifyMusicData.artist.id,
        spotifyCoverUrl: spotifyMusicData.artist.coverUrl,
        spotifyGenre: spotifyMusicData.artist.genre
      })
    }

    let albumTableId
    const albumInDb = await this.albumsModel.findBySpotifyIdReturnOnlyId(
      spotifyMusicData.album.id
    )
    if (albumInDb.length) {
      albumTableId = albumInDb[0].id
    } else {
      albumTableId = await this.albumsModel.create({
        name: spotifyMusicData.album.name,
        spotifyId: spotifyMusicData.album.id,
        spotifyCoverUrl: spotifyMusicData.album.coverUrl,
        spotifyYear: String(spotifyMusicData.album.year)
      })
    }
    const musicId = uuid()
    await db('musics').insert({
      id: musicId,
      name: spotifyMusicData.name,
      artistId: artistTableId,
      albumId: albumTableId,
      youtubeId,
      spotifyId: spotifyMusicData.id,
      discNumber: spotifyMusicData.discNumber,
      trackNumber: spotifyMusicData.trackNumber
    })
    return musicId
  }

  async list(withAlbum: boolean, withArtist: boolean, pag: number) {
    const { query, rowManager } = useOptionalData(
      withAlbum,
      withArtist,
      db('musics')
    )

    query.offset(pag * 10)
    query.orderBy('musics.name', 'asc')
    query.limit(10)

    const rows = await query
    return rows.map(rowManager)
  }

  async search(
    withAlbum: boolean,
    withArtist: boolean,
    pag: number,
    name: string
  ) {
    const { query, rowManager } = useOptionalData(
      withAlbum,
      withArtist,
      db('musics')
    )

    query.offset(pag * 10)
    query.where('musics.name', 'LIKE', `%${name}%`)
    query.orderBy('musics.name', 'asc')
    query.limit(10)

    const rows = await query
    return rows.map(rowManager)
  }

  async get(withAlbum: boolean, withArtist: boolean, id: string) {
    const { query, rowManager } = useOptionalData(
      withAlbum,
      withArtist,
      db('musics')
    )
    query.where('musics.id', id)
    const row = await query.first()
    return row ? rowManager(row) : null
  }

  async getOnlyColumns(id: string, columns: Array<keyof Music>) {
    return await db<Music>('musics').select(columns).where('id', id).first()
  }

  async getByAlbum(
    albumId: string,
    withAlbum: boolean,
    withArtist: boolean,
    pag: number
  ) {
    if (!this.albumsModel) throw new Error('Invalid Album Model')
    const albumsExists = await this.albumsModel.exists(albumId)
    if (!albumsExists) throw new AlbumNotExists()
    const { query, rowManager } = useOptionalData(
      withAlbum,
      withArtist,
      db('musics')
    )

    query.where('musics.albumId', '=', albumId)
    query.offset(pag * 10)
    query.orderBy('musics.name', 'asc')
    query.limit(10)

    const rows = await query
    return rows.map(rowManager)
  }

  async getByArtist(
    artistId: string,
    withAlbum: boolean,
    withArtist: boolean,
    pag: number
  ) {
    if (!this.artistsModel) throw new Error('Invalid Artist Model')
    const artistsExists = await this.artistsModel.exists(artistId)
    if (!artistsExists) throw new ArtistNotExists()
    const { query, rowManager } = useOptionalData(
      withAlbum,
      withArtist,
      db('musics')
    )

    query.where('musics.artistId', '=', artistId)
    query.offset(pag * 10)
    query.orderBy('musics.name', 'asc')
    query.limit(10)

    const rows = await query
    return rows.map(rowManager)
  }

  async isExists(musicId: string) {
    const ele = await db<Music>('musics').select().where('id', musicId).first()
    return ele !== undefined
  }

  async getPlaylists(musicId: string) {
    if (!this.playlistModel) throw new Error('Invalid Playlist Model')
    const exists = await this.isExists(musicId)
    if (!exists) throw new NotFoundMusic()

    const playlistsIds = await db<Pick<PlaylistItem, 'playlistId'>>(
      'musics_playlists'
    )
      .where('musicId', musicId)
      .select('playlistId')

    return playlistsIds
  }

  async deleteMusic(musicId: string) {
    const playlists = await this.getPlaylists(musicId)
    const promises = playlists.map(async ({ playlistId }) => {
      return this.playlistModel?.removeMusic(playlistId, musicId)
    })
    await Promise.all(promises)

    await db('musics').delete().where('id', musicId)
  }
}
