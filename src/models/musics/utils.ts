import { Knex } from 'knex/types'

import { MusicList } from './types'
// Copy from knex/types
type DeferredKeySelection<
  // The base of selection. In intermediate stages this may be unknown.
  // If it remains unknown at the point of resolution, the selection will fall back to any
  TBase,
  // Union of keys to be selected
  // In intermediate stages this may be never.
  TKeys extends string,
  // Changes how the resolution should behave if TKeys is never.
  // If true, then we assume that some keys were selected, and if TKeys is never, we will fall back to any.
  // If false, and TKeys is never, then we select TBase in its entirety
  THasSelect extends true | false = false,
  // Mapping of aliases <key in result> -> <key in TBase>
  TAliasMapping extends {} = {},
  // If enabled, then instead of extracting a partial, during resolution
  // we will pick just a single property.
  TSingle extends boolean = false,
  // Extra props which will be intersected with the result
  TIntersectProps extends {} = {},
  // Extra props which will be unioned with the result
  TUnionProps = never
> = {
  // These properties are not actually used, but exist simply because
  // typescript doesn't end up happy when type parameters are unused
  _base: TBase
  _hasSelection: THasSelect
  _keys: TKeys
  _aliases: TAliasMapping
  _single: TSingle
  _intersectProps: TIntersectProps
  _unionProps: TUnionProps
}

type Query = Knex.QueryBuilder<
  any,
  DeferredKeySelection<any, never, false, {}, false, {}, never>[]
>

export function useOptionalData(
  withAlbum: boolean,
  withArtist: boolean,
  query: Query
) {
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
  query.select(columns)
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
