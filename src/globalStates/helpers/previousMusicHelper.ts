import { State } from '@hookstate/core'

import { ActualMusicStateType } from '../states/actualMusic'
import { MusicListStateType } from '../states/musicList'

export function previousMusicHelper(
  actualMusicState: State<ActualMusicStateType>,
  musicListState: State<MusicListStateType>
) {
  const actualMusic = actualMusicState.get()
  const musicList = musicListState.value

  let index = -1
  if (actualMusic) {
    const result = musicList.findIndex(music => music.id === actualMusic?.id)
    if (result !== undefined) index = result
  }
  const previousMusic = musicList[index - 1]
  if (previousMusic) {
    actualMusicState.set(JSON.parse(JSON.stringify(previousMusic)))
  }
}
