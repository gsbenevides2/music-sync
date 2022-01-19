import React from 'react'

import { createState, DevTools, useState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'

import { VOLUME_KEY } from '../../utils/settings/keys'
import { getAudioElement } from '../AudioPlayerElement'
import { volumeDownHelper } from '../helpers/volumeDownHelper'
import { volumeUpHelper } from '../helpers/volumeUpHelper'

export type VolumeStateType = number

export const volumeGlobalState = createState<VolumeStateType>(0)
DevTools(volumeGlobalState).label('Volume')

export const useVolumeState = () => {
  return useState(volumeGlobalState)
}

export const startVolumeState = () => {
  const volumeState = useVolumeState()

  React.useEffect(() => {
    const audioElement = getAudioElement()
    volumeState.attach(() => {
      return {
        id: Symbol('VolumePlugin'),
        init: () => {
          return {
            onSet: args => {
              const volume = args.value as VolumeStateType
              audioElement.volume = volume
            }
          }
        }
      }
    })
    const abortController = new AbortController()

    window.addEventListener(
      'keydown',
      e => {
        if (e.code === 'ArrowDown') volumeDownHelper(volumeState)
        else if (e.code === 'ArrowUp') volumeUpHelper(volumeState)
      },
      { signal: abortController.signal }
    )
    volumeState.attach(Persistence(VOLUME_KEY))

    return () => {
      abortController.abort()
    }
  }, [])
}
