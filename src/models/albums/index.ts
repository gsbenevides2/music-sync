import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { Album } from './types'

export class AlbumsModel {
  async search(name: string, pag: number) {
    const rows = (await db('albums')
      .select('*')
      .where('name', 'LIKE', `%${name}%`)
      .offset(pag * 10)
      .orderBy('name', 'asc')
      .limit(10)) as Album[]
    return rows
  }

  async list(pag: number) {
    return (await db('albums')
      .select('*')
      .offset(pag * 10)
      .orderBy('name', 'asc')
      .limit(10)) as Album[]
  }

  async findBySpotifyIdReturnOnlyId(spotifyId: string) {
    return (await db('albums')
      .select('id')
      .where('spotifyId', spotifyId)) as Pick<Album, 'id'>[]
  }

  async create(data: Omit<Album, 'id' | 'createdAt'>) {
    const albumTableId = uuid()
    await db('albums').insert({
      id: albumTableId,
      ...data
    })
    return albumTableId
  }
}
