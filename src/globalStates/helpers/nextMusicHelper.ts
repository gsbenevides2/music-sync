import { State } from '@hookstate/core'

import { ActualMusicStateType } from '../states/actualMusic'
import { MusicListStateType } from '../states/musicList'

export function nextMusicHelper(
  actualMusicState: State<ActualMusicStateType>,
  musicListState: State<MusicListStateType>
) {
  const actualMusic = actualMusicState.get()
  const musicList = musicListState.get()

  let index = -1
  if (actualMusic) {
    const result = musicList.findIndex(music => music.id === actualMusic?.id)
    if (result !== undefined) index = result
  }
  const nextMusic = musicList[index + 1]
  if (nextMusic) {
    actualMusicState.set(JSON.parse(JSON.stringify(nextMusic)))
  }
}
