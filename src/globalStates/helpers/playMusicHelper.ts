import api from '../../services/api/api'
import { getSetting } from '../../utils/settings'
import { OFFLINE_KEY, OFFLINE_PRIORITY_KEY } from '../../utils/settings/keys'
import { getAudioElement } from '../AudioPlayerElement'
import { ActualMusicStateType } from '../states/actualMusic'

export function playMusicHelper(music: ActualMusicStateType) {
  if (music === null) return
  const offline = getSetting(OFFLINE_KEY)
  const offlinePriority = getSetting(OFFLINE_PRIORITY_KEY)
  const onLine = navigator.onLine
  const audioElement = getAudioElement()

  const controller = new AbortController()

  function loadedCallback() {
    audioElement.play()
    controller.abort()
  }

  function loadAudioOffline() {
    if (music === null) return
    const sessionId = localStorage.getItem('sessionId') as string
    const token = localStorage.getItem('token') as string
    // const serverUrl = `${api.defaults.baseURL}musics/play?ytId=${music.youtubeId}&authorization=${token}&sessionid=${sessionId}`
    const serverUrl = `http://localhost:4499/audio?ytId=${music.youtubeId}&authorization=${token}&sessionid=${sessionId}`
    audioElement.src = serverUrl
  }

  function loadAudioOnline() {
    if (music === null) return
    const sessionId = localStorage.getItem('sessionId') as string
    const token = localStorage.getItem('token') as string
    const serverUrl = `${api.defaults.baseURL}musics/play?ytId=${music.youtubeId}&authorization=${token}&sessionid=${sessionId}`
    // const serverUrl = `http://localhost:4499/audio?ytId=${music.youtubeId}&authorization=${token}&sessionid=${sessionId}`
    audioElement.src = serverUrl
  }

  audioElement.addEventListener('loadeddata', loadedCallback, {
    signal: controller.signal
  })
  audioElement.addEventListener(
    'error',
    () => {
      loadAudioOnline()
    },
    {
      signal: controller.signal
    }
  )

  if (onLine) {
    if (offline && offlinePriority) loadAudioOffline()
    else loadAudioOnline()
  } else {
    if (offline) loadAudioOffline()
  }
}
