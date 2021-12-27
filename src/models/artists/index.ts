import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { Artist } from './types'

export class ArtistsModel {
  async search(name: string, pag: number) {
    return (await db('artists')
      .select('*')
      .where('name', 'LIKE', `%${name}%`)
      .offset(pag * 10)
      .orderBy('name', 'asc')
      .limit(10)) as Artist[]
  }

  async list(pag: number) {
    return (await db('artists')
      .select('*')
      .offset(pag * 10)
      .orderBy('name', 'asc')
      .limit(10)) as Artist[]
  }

  async findBySpotifyIdReturnOnlyId(spotifyId: string) {
    return (await db('artists')
      .select('id')
      .where('spotifyId', spotifyId)) as Pick<Artist, 'id'>[]
  }

  async create(data: Omit<Artist, 'id' | 'createdAt'>) {
    const artistTableId = uuid()
    await db('artists').insert({
      id: artistTableId,
      ...data
    })
    return artistTableId
  }
}
