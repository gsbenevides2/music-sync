import React from 'react'

export function useMediaSessionHandlers(
  audio: React.MutableRefObject<HTMLAudioElement>,
  nextMusic: () => void,
  previousMusic: () => void,
  setPosition: (pos: number) => void
) {
  React.useEffect(() => {
    if ('mediaSession' in navigator) {
      const skipTime = 5
      navigator.mediaSession.setActionHandler('play', () => {
        audio.current.play()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.current.pause()
      })

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextMusic()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        previousMusic()
      })

      navigator.mediaSession.setActionHandler('seekbackward', () => {
        setPosition(Math.max(audio.current.currentTime - skipTime, 0))
      })
      navigator.mediaSession.setActionHandler('seekforward', () => {
        const newTime = audio.current.currentTime + skipTime

        if (newTime > audio.current.duration) {
          setPosition(audio.current.duration)
        } else {
          setPosition(newTime)
        }
      })
    }
  }, [nextMusic, previousMusic])
}
