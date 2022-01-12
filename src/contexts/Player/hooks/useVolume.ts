import React from 'react'

import { getSettingString, setSetting } from '../../../utils/settings'
import { VOLUME_KEY } from '../../../utils/settings/keys'

export function useVoulume(audio: React.MutableRefObject<HTMLAudioElement>) {
  const [volume, setVolume] = React.useState(0)
  const volumeChange = React.useCallback((newVolume: number) => {
    setVolume(newVolume)
    audio.current.volume = newVolume
    setSetting(VOLUME_KEY, newVolume.toString())
  }, [])

  const volumeDown = () => {
    if (volume - 0.01 <= 0) volumeChange(0)
    else volumeChange(volume - 0.01)
  }

  const volumeUp = () => {
    if (volume + 0.01 >= 1) volumeChange(1)
    else volumeChange(volume + 0.01)
  }

  React.useEffect(() => {
    const storedVolume = parseFloat(
      getSettingString(VOLUME_KEY) || audio.current.volume.toString()
    )
    audio.current.volume = storedVolume
    setVolume(storedVolume)
  })
  return { volume, volumeChange, volumeUp, volumeDown }
}
