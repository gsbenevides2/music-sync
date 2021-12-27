import React from 'react'

import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function useKeyboardToHandleEvents(
  audio: React.MutableRefObject<HTMLAudioElement>,
  actualMusic: MusicWithArtistAndAlbum | undefined
) {
  React.useEffect(() => {
    if (!actualMusic) return () => {}

    const abortController = new AbortController()
    window.addEventListener(
      'keypress',
      e => {
        if (e.code === 'Space') {
          if (audio.current.paused) audio.current.play()
          else audio.current.pause()
        }
      },
      { signal: abortController.signal }
    )

    return abortController.abort
  }, [actualMusic])
}
