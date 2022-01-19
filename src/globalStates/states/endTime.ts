import React from 'react'

import { createState, useState } from '@hookstate/core'

import { getAudioElement } from '../AudioPlayerElement'

export type EndTimeStateType = number

export const endTimeGlobalState = createState<EndTimeStateType>(0)

export const useEndTimeState = () => {
  return useState(endTimeGlobalState)
}

export const startEndTimeState = () => {
  const endTimeState = useEndTimeState()

  React.useEffect(() => {
    const abortController = new AbortController()
    const audioElement = getAudioElement()
    audioElement.addEventListener(
      'durationchange',
      () => {
        const duration = audioElement.duration
        const noValidValues = [NaN, Infinity, undefined]
        if (noValidValues.includes(duration)) endTimeState.set(0)
        else endTimeState.set(duration as number)
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
