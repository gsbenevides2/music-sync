import React from 'react'
import {
  MdPause,
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious
} from 'react-icons/md'

import { nextMusicHelper } from '../../globalStates/helpers/nextMusicHelper'
import { previousMusicHelper } from '../../globalStates/helpers/previousMusicHelper'
import { useActualMusicState } from '../../globalStates/states/actualMusic'
import { useIsPlayingState } from '../../globalStates/states/isPlaying'
import { useMusicListState } from '../../globalStates/states/musicList'
import { useWaitingState } from '../../globalStates/states/waiting'
import CircleButton from '../CircleButton'

export const ControlsButtons: React.FC = () => {
  const waitingState = useWaitingState()
  const isPlayingState = useIsPlayingState()
  const musicListState = useMusicListState()
  const actualMusicState = useActualMusicState()
  const isPlaying = isPlayingState.get()
  const isWaiting = waitingState.get()

  function previousClick() {
    previousMusicHelper(actualMusicState, musicListState)
  }
  function playOrPauseClick() {
    isPlayingState.set(!isPlaying)
  }
  function nextClick() {
    nextMusicHelper(actualMusicState, musicListState)
  }

  return (
    <div className="playerButtons flex">
      <CircleButton onClick={previousClick}>
        <MdSkipPrevious />
      </CircleButton>
      <CircleButton onClick={playOrPauseClick} disabled={isWaiting}>
        {isPlaying ? <MdPause size={40} /> : <MdPlayArrow size={40} />}
      </CircleButton>
      <CircleButton onClick={nextClick}>
        <MdSkipNext />
      </CircleButton>
    </div>
  )
}
