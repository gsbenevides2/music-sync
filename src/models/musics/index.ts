import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { SpotifyService } from '../../services/spotify'
import { YoutubeService } from '../../services/youtube'
import { AlbumsModel } from '../albums'
import { ArtistsModel } from '../artists'
import { MusicAlreadyExists, SelectYoutubeMusic } from './errors'
import { Music, MusicList } from './types'

const artistsModel = new ArtistsModel()
const albumsModel = new AlbumsModel()
const spotifyService = new SpotifyService()
const youtubeService = new YoutubeService()

function useOptionalData(withAlbum: boolean, withArtist: boolean) {
  const columns = [
    'musics.id as musicId',
    'musics.name as musicName',
    'musics.youtubeId as youtubeId',
    'musics.spotifyId as musicSpotifyId',
    'musics.trackNumber as trackNumber',
    'musics.discNumber as discNumber',
    'musics.lyrics as lyrics',
    'musics.createdAt as musicCreatedAt'
  ]
  if (withAlbum) {
    columns.push(
      'albums.id as albumId',
      'albums.name as albumName',
      'albums.spotifyId as albumSpotifyId',
      'albums.spotifyCoverUrl as albumsSpotifyCoverUrl',
      'albums.spotifyYear as albumSpotifyYear',
      'albums.createdAt as albumCreatedAt'
    )
  } else {
    columns.push('musics.albumId as albumId')
  }
  if (withArtist) {
    columns.push(
      'artists.id as artistId',
      'artists.name as artistName',
      'artists.spotifyId as artistSpotifyId',
      'artists.spotifyCoverUrl as artistSpotifyCoverUrl',
      'artists.spotifyGenre as artistSpotifyGenre',
      'artists.createdAt as artistCreatedAt'
    )
  } else {
    columns.push('musics.artistId as artistsId')
  }
  const query = db('musics').select(columns)
  if (withAlbum) query.innerJoin('albums', 'albums.id', 'musics.albumId')
  if (withArtist) query.innerJoin('artists', 'artists.id', 'musics.artistId')
  function rowManager(row: any) {
    let music: MusicList = {
      id: row.musicId,
      name: row.musicName,
      youtubeId: row.youtubeId,
      spotifyId: row.musicSpotifyId,
      trackNumber: row.trackNumber,
      discNumber: row.discNumber,
      lyrics: row.lyrics,
      createdAt: row.musicCreatedAt
    }
    if (withAlbum) {
      music = {
        ...music,
        album: {
          id: row.albumId,
          name: row.albumName,
          spotifyId: row.albumSpotifyId,
          spotifyCoverUrl: row.albumsSpotifyCoverUrl,
          spotifyYear: row.albumSpotifyYear,
          createdAt: row.albumCreatedAt
        }
      }
    } else {
      music.albumId = row.albumId
    }
    if (withArtist) {
      music = {
        ...music,
        artist: {
          id: row.artistId,
          name: row.artistName,
          spotifyId: row.artistSpotifyId,
          spotifyCoverUrl: row.artistSpotifyCoverUrl,
          spotifyGenre: row.artistSpotifyGenre,
          createdAt: row.artistCreatedAt
        }
      }
    } else {
      music.artistId = row.artistId
    }
    return music
  }
  return {
    query,
    rowManager
  }
}

export class MusicsModel {
  async create(spotifyLink: string, useYoutubeId?: string) {
    const spotifyMusicData = await spotifyService.getMusicData(spotifyLink)

    const rowsAlreadyExists = await db<Pick<Music, 'id'>>('musics')
      .select('id')
      .where('spotifyId', spotifyMusicData.id)
    if (rowsAlreadyExists.length)
      throw new MusicAlreadyExists(rowsAlreadyExists[0].id)

    const youtubeData = await youtubeService.getMusic(
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
    const artistInDb = await artistsModel.findBySpotifyIdReturnOnlyId(
      spotifyMusicData.artist.id
    )
    if (artistInDb.length) {
      artistTableId = artistInDb[0].id
    } else {
      artistTableId = await artistsModel.create({
        name: spotifyMusicData.artist.name,
        spotifyId: spotifyMusicData.artist.id,
        spotifyCoverUrl: spotifyMusicData.artist.coverUrl,
        spotifyGenre: spotifyMusicData.artist.genre
      })
    }

    let albumTableId
    const albumInDb = await albumsModel.findBySpotifyIdReturnOnlyId(
      spotifyMusicData.album.id
    )
    if (albumInDb.length) {
      albumTableId = albumInDb[0].id
    } else {
      albumTableId = await albumsModel.create({
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
    const { query, rowManager } = useOptionalData(withAlbum, withArtist)

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
    const { query, rowManager } = useOptionalData(withAlbum, withArtist)

    query.offset(pag * 10)
    query.where('musics.name', 'LIKE', `%${name}%`)
    query.orderBy('musics.name', 'asc')
    query.limit(10)

    const rows = await query
    return rows.map(rowManager)
  }

  async get(withAlbum: boolean, withArtist: boolean, id: string) {
    const { query, rowManager } = useOptionalData(withAlbum, withArtist)
    query.where('musics.id', id)
    const row = await query.first()
    return row ? rowManager(row) : null
  }

  async getOnlyColumns(id: string, columns: Array<keyof Music>) {
    return await db<Music>('musics').select(columns).where('id', id).first()
  }
}
