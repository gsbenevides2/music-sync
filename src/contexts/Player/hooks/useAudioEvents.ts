import React from 'react'

export function useAudioEvents(
  audio: React.MutableRefObject<HTMLAudioElement>,
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setDuration: React.Dispatch<React.SetStateAction<number>>,
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  nextMusic: () => void,
  setWaiting: React.Dispatch<React.SetStateAction<boolean>>
) {
  React.useEffect(() => {
    const abortController = new window.AbortController()
    const options = { signal: abortController.signal }

    /*
    function updateMediaSession() {
      if (
        audio.current.duration === Infinity ||
        audio.current.currentTime === Infinity ||
        isNaN(audio.current.duration) ||
        isNaN(audio.current.currentTime)
      )
        return
      navigator.mediaSession.setPositionState({
        duration: audio.current.duration,
        playbackRate: audio.current.playbackRate,
        position: audio.current.currentTime
      })
    }
    */
    audio.current.addEventListener(
      'error',
      e => {
        console.error(e)
      },
      options
    )
    audio.current.addEventListener(
      'play',
      () => {
        setPlaying(true)
      },
      options
    )
    audio.current.addEventListener(
      'waiting',
      () => {
        setWaiting(true)
      },
      options
    )
    audio.current.addEventListener(
      'seeked',
      () => {
        setWaiting(false)
      },
      options
    )

    audio.current.addEventListener(
      'ended',
      () => {
        setPlaying(false)
        nextMusic()
      },
      options
    )

    audio.current.addEventListener(
      'pause',
      () => {
        setPlaying(false)
      },
      options
    )

    audio.current.addEventListener(
      'durationchange',
      () => {
        setDuration(audio.current.duration)
        // updateMediaSession()
      },
      options
    )

    audio.current.addEventListener(
      'timeupdate',
      () => {
        setCurrentTime(audio.current.currentTime)
        // updateMediaSession()
      },
      options
    )

    // audio.current.addEventListener('duration', updateMediaSession, options)

    return () => {
      abortController.abort()
    }
  }, [nextMusic])
}
