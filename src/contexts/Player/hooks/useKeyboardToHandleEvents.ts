import React from 'react'

import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function useKeyboardToHandleEvents(
  audio: React.MutableRefObject<HTMLAudioElement>,
  actualMusic: MusicWithArtistAndAlbum | undefined,
  nextMusic: () => void,
  previousMusic: () => void
) {
  React.useEffect(() => {
    if (!actualMusic) return () => {}

    const abortController = new AbortController()
    window.addEventListener(
      'keypress',
      e => {
        const keyCode = e.code
        if (e.code === 'Space') {
          if (audio.current.paused) audio.current.play()
          else audio.current.pause()
        } else if (keyCode === 'KeyP') previousMusic()
        else if (keyCode === 'KeyN') nextMusic()
      },
      { signal: abortController.signal }
    )

    return () => {
      abortController.abort()
    }
  }, [actualMusic])
}
