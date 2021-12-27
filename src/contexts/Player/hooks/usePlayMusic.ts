import React from 'react'

import api from '../../../services/api/api'
import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function usePlayMusic(
  audio: React.MutableRefObject<HTMLAudioElement>,
  setActualMusic: React.Dispatch<
    React.SetStateAction<MusicWithArtistAndAlbum | undefined>
  >,
  setWaiting: React.Dispatch<React.SetStateAction<boolean>>
) {
  return React.useCallback(
    (music: MusicWithArtistAndAlbum) => {
      const controller = new AbortController()

      function loadedCallback() {
        audio.current.play()
        controller.abort()
        setWaiting(false)
      }

      function loadAudio() {
        setWaiting(true)
        const sessionId = localStorage.getItem('sessionId') as string
        const token = localStorage.getItem('token') as string
        const serverUrl = `${api.defaults.baseURL}musics/play?ytId=${music.youtubeId}&authorization=${token}&sessionid=${sessionId}`
        audio.current.src = serverUrl
      }

      setActualMusic(music)
      audio.current.addEventListener('loadeddata', loadedCallback, {
        signal: controller.signal
      })
      loadAudio()
    },
    [audio]
  )
}
