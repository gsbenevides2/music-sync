import React from 'react'

export function useSetAudioPosition(
  audio: React.MutableRefObject<HTMLAudioElement>,
  setPosition: React.Dispatch<React.SetStateAction<number>>
) {
  return React.useCallback((position: number) => {
    audio.current.currentTime = position
    setPosition(position)
  }, [])
}
