import React from 'react'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { MusicListContext } from '../MusicList'
import { useAudioEvents } from './hooks/useAudioEvents'
import { useKeyboardToHandleEvents } from './hooks/useKeyboardToHandleEvents'
import { useMediaSessionHandlers } from './hooks/useMediaSessionHandlers'
import { useMediaSessionMetadata } from './hooks/useMediaSessionMetadata'
import { useNextMusic } from './hooks/useNextMusic'
import { usePlayMusic } from './hooks/usePlayMusic'
import { usePlayOrPause } from './hooks/usePlayOrPause'
import { usePreviousMusic } from './hooks/usePreviousMusic'
import { useSetAudioPosition } from './hooks/useSetAudioPosition'

interface Context {
  playMusic: (music: MusicWithArtistAndAlbum) => void
  nextMusic: () => void
  playOrPause: () => void
  previousMusic: () => void
  setPosition: (position: number) => void
  actualMusic: MusicWithArtistAndAlbum | undefined
  playing: boolean
  waiting: boolean
  duration: number
  currentTime: number
}

export const PlayerContext = React.createContext<Context | null>(null)

export const PlayerContextProvider: React.FC = ({ children }) => {
  const musicListContext = React.useContext(MusicListContext)
  const audio = React.useRef<HTMLAudioElement>(new Audio())
  const [actualMusic, setActualMusic] = React.useState<
    MusicWithArtistAndAlbum | undefined
  >(undefined)
  const [playing, setPlaying] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [waiting, setWaiting] = React.useState(false)

  const playMusic = usePlayMusic(audio, setActualMusic, setWaiting)
  const nextMusic = useNextMusic(
    musicListContext?.musicList || [],
    actualMusic,
    playMusic
  )
  const playOrPause = usePlayOrPause(audio)
  const previousMusic = usePreviousMusic(
    musicListContext?.musicList || [],
    actualMusic,
    playMusic
  )
  const setPosition = useSetAudioPosition(audio, setCurrentTime)

  useAudioEvents(
    audio,
    setPlaying,
    setDuration,
    setCurrentTime,
    nextMusic,
    setWaiting
  )
  useMediaSessionHandlers(audio, nextMusic, previousMusic, setPosition)
  useKeyboardToHandleEvents(audio, actualMusic, previousMusic, nextMusic)
  useMediaSessionMetadata(actualMusic)

  return (
    <PlayerContext.Provider
      value={{
        waiting,
        playMusic,
        previousMusic,
        playOrPause,
        nextMusic,
        setPosition,
        actualMusic,
        playing,
        duration,
        currentTime
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
