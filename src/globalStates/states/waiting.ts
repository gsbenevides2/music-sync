import React from 'react'

import { createState, useState } from '@hookstate/core'

import { getAudioElement } from '../AudioPlayerElement'

export type WaitingStateType = boolean

export const waitingGlobalState = createState<WaitingStateType>(false)

export const useWaitingState = () => {
  return useState(waitingGlobalState)
}

export const startWaitingState = () => {
  const waitingState = useWaitingState()

  React.useEffect(() => {
    const audioElement = getAudioElement()

    const abortController = new AbortController()

    audioElement.addEventListener(
      'waiting',
      () => {
        waitingState.set(true)
      },
      {
        signal: abortController.signal
      }
    )

    audioElement.addEventListener(
      'seeked',
      () => {
        waitingState.set(false)
      },
      {
        signal: abortController.signal
      }
    )

    return () => {
      abortController.abort()
    }
  }, [])
}
