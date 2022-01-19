import React from 'react'

import { createState, useState } from '@hookstate/core'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { getAudioElement } from '../AudioPlayerElement'
import { mediaSessionMetadataHelper } from '../helpers/mediaSessionMetadataHelper'
import { nextMusicHelper } from '../helpers/nextMusicHelper'
import { playMusicHelper } from '../helpers/playMusicHelper'
import { previousMusicHelper } from '../helpers/previousMusicHelper'
import { useMusicListState } from './musicList'

export type ActualMusicStateType = MusicWithArtistAndAlbum | null

export const actualMusicGlobalState = createState<ActualMusicStateType>(null)

export const useActualMusicState = () => {
  return useState(actualMusicGlobalState)
}

export const startActualMusicState = () => {
  const actualMusicState = useActualMusicState()
  const musicListState = useMusicListState()

  React.useEffect(() => {
    actualMusicState.attach(() => {
      return {
        id: Symbol('ActualMusicPlugin'),
        init: () => {
          return {
            onSet: args => {
              const music = args.value as ActualMusicStateType

              playMusicHelper(music)
              mediaSessionMetadataHelper(music)
            }
          }
        }
      }
    })
    const abortController = new AbortController()
    const audioElement = getAudioElement()

    audioElement.addEventListener(
      'ended',
      () => {
        nextMusicHelper(actualMusicState, musicListState)
      },
      { signal: abortController.signal }
    )

    window.addEventListener(
      'keydown',
      e => {
        if (e.code === 'ArrowLeft')
          previousMusicHelper(actualMusicState, musicListState)
        else if (e.code === 'ArrowRight')
          nextMusicHelper(actualMusicState, musicListState)
      },
      { signal: abortController.signal }
    )

    if ('mediadSession' in navigator) {
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextMusicHelper(actualMusicState, musicListState)
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        previousMusicHelper(actualMusicState, musicListState)
      })
    }

    return () => {
      abortController.abort()
    }
  }, [])
}
