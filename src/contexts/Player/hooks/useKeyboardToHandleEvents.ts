import React from 'react'

import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function useKeyboardToHandleEvents(
  audio: React.MutableRefObject<HTMLAudioElement>,
  actualMusic: MusicWithArtistAndAlbum | undefined,
  nextMusic: () => void,
  previousMusic: () => void,
  volumeUp: () => void,
  volumeDown: () => void
) {
  React.useEffect(() => {
    if (!actualMusic) return () => {}

    const abortController = new AbortController()
    window.addEventListener(
      'keydown',
      e => {
        const keyCode = e.code
        if (e.code === 'Space') {
          if (audio.current.paused) audio.current.play()
          else audio.current.pause()
        } else if (keyCode === 'ArrowRight') previousMusic()
        else if (keyCode === 'ArrowLeft') nextMusic()
        else if (keyCode === 'ArrowUp') volumeUp()
        else if (keyCode === 'ArrowDown') volumeDown()
      },
      { signal: abortController.signal }
    )

    return () => {
      abortController.abort()
    }
  }, [actualMusic,volumeUp])
}
