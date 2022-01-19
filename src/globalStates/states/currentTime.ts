import React from 'react'

import { createState, DevTools, useState } from '@hookstate/core'

import { getAudioElement } from '../AudioPlayerElement'

export type CurrentTimeStateType = number

export const currentTimeGlobalState = createState<CurrentTimeStateType>(0)
DevTools(currentTimeGlobalState).label('CurrentTime')

export const useCurrentTimeState = () => {
  return useState(currentTimeGlobalState)
}

export const startCurrentTimeState = () => {
  const currentTimeState = useCurrentTimeState()

  React.useEffect(() => {
    const audioElement = getAudioElement()
    currentTimeState.attach(() => {
      return {
        id: Symbol('CurrentTimePlugin'),
        init: () => {
          return {
            onSet: args => {
              const currentTime = args.value as CurrentTimeStateType
              const oldCurrentTime = args.previous as CurrentTimeStateType

              if (
                audioElement.currentTime !== currentTime &&
                currentTime !== oldCurrentTime
              ) {
                audioElement.currentTime = currentTime
              }
            }
          }
        }
      }
    })
    const abortController = new AbortController()

    audioElement.addEventListener(
      'timeupdate',
      () => {
        currentTimeState.set(audioElement.currentTime || 0)
      },
      { signal: abortController.signal }
    )

    if ('mediaSession' in navigator) {
      const skipTime = 5
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        currentTimeState.set(Math.max(audioElement.currentTime - skipTime, 0))
      })
      navigator.mediaSession.setActionHandler('seekforward', () => {
        currentTimeState.set(
          Math.min(
            audioElement.currentTime + skipTime,
            audioElement.currentTime
          )
        )
      })
    }

    return () => {
      abortController.abort()
    }
  }, [])
}
