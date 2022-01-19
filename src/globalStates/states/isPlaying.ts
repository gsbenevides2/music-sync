import React from 'react'

import { createState, useState, DevTools } from '@hookstate/core'

import { getAudioElement } from '../AudioPlayerElement'

export type IsPlayingStateType = boolean

export const isPlayingGlobalState = createState<IsPlayingStateType>(false)

DevTools(isPlayingGlobalState).label('IsPlaying')

export const useIsPlayingState = () => {
  return useState(isPlayingGlobalState)
}

export const startIsPlayingState = () => {
  const isPlayingState = useIsPlayingState()

  React.useEffect(() => {
    const audioElement = getAudioElement()

    isPlayingState.attach(() => {
      return {
        id: Symbol('IsPlayingPlugin'),
        init: () => {
          return {
            onSet: args => {
              const isPlaying = args.value as IsPlayingStateType

              if (isPlaying) audioElement.play()
              else audioElement.pause()
            }
          }
        }
      }
    })

    const abortController = new AbortController()

    audioElement.addEventListener(
      'ended',
      () => {
        if (isPlayingState.get() === true) isPlayingState.set(false)
      },
      {
        signal: abortController.signal
      }
    )

    audioElement.addEventListener(
      'playing',
      () => {
        if (isPlayingState.get() === false) isPlayingState.set(true)
      },
      {
        signal: abortController.signal
      }
    )

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        isPlayingState.set(true)
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        isPlayingState.set(false)
      })
    }

    window.addEventListener(
      'keydown',
      e => {
        if (e.code === 'Space') isPlayingState.set(v => !v)
      },
      { signal: abortController.signal }
    )

    return () => {
      abortController.abort()
    }
  }, [])
}
