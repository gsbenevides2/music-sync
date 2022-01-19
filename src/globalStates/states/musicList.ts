import { createState, useState } from '@hookstate/core'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'

export type MusicListStateType = MusicWithArtistAndAlbum[]

export const musicListGlobalState = createState<MusicListStateType>([])

export const useMusicListState = () => {
  return useState(musicListGlobalState)
}
