import React from 'react'

export function usePlayOrPause(
  audio: React.MutableRefObject<HTMLAudioElement>
) {
  return React.useCallback(() => {
    if (audio.current.paused) {
      audio.current.play()
    } else {
      audio.current.pause()
    }
  }, [])
}
