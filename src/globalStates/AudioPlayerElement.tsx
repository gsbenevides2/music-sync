import React from 'react'

import { startActualMusicState } from './states/actualMusic'
import { startCurrentTimeState } from './states/currentTime'
import { startEndTimeState } from './states/endTime'
import { startIsPlayingState } from './states/isPlaying'
import { startVolumeState } from './states/volume'
import { startWaitingState } from './states/waiting'

export function getAudioElement() {
  return document.getElementById('audio-element') as HTMLAudioElement
}

export const AudioPlayerElement: React.FC = ({ children }) => {
  startActualMusicState()
  startVolumeState()
  startEndTimeState()
  startIsPlayingState()
  startCurrentTimeState()
  startWaitingState()

  return (
    <>
      <audio id="audio-element" />
      {children}
    </>
  )
}
