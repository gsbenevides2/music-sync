import { createState, DevTools, useState } from '@hookstate/core'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'

export type MusicListStateType = MusicWithArtistAndAlbum[]

export const musicListGlobalState = createState<MusicListStateType>([])
DevTools(musicListGlobalState).label('MusicList')

export const useMusicListState = () => {
  return useState(musicListGlobalState)
}
