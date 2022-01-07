import React from 'react'
import { MdClose, MdDone } from 'react-icons/md'

import { useMessage } from '../../components/Message/index.'
import { OptionsItem, OptionsList } from '../../components/OptionsList'
import { ScreenContainer } from '../../components/ScreenContainer'
import api from '../../services/api/api'
import { getSettingString, setSetting } from '../../utils/settings'
import { AUTH_WAITING_KEY } from '../../utils/settings/keys'

interface Result {
  result: boolean
}

export const SocialAuthManagerScreen: React.FC = () => {
  const [spotify, setSpotify] = React.useState<boolean>()
  const [youtube, setYoutube] = React.useState<boolean>()
  const showMessage = useMessage()

  const spotifyGo = React.useCallback(() => {
    setSetting(AUTH_WAITING_KEY, '')
    api.get<string>('/spotifyAuth').then(response => {
      window.open(response.data)
      const interval = setInterval(() => {
        const authState = getSettingString(AUTH_WAITING_KEY)
        if (authState === 'ok') {
          setSpotify(true)
          showMessage('SpotifyOK')
          console.log(interval)
          clearInterval(interval)
        }
      }, 1000)
    })
  }, [])

  const youtubeGo = React.useCallback(() => {
    setSetting(AUTH_WAITING_KEY, '')
    api.get<string>('/youtubeAuth').then(response => {
      window.open(response.data)
      const interval = setInterval(() => {
        const authState = getSettingString(AUTH_WAITING_KEY)
        if (authState === 'ok') {
          setYoutube(true)
          showMessage('YoutubeOK')
          clearInterval(interval)
        }
      }, 1000)
    })
  }, [])

  React.useEffect(() => {
    function loadData() {
      api.get<Result>('/spotifyAuth/isAuthenticated').then(result => {
        setSpotify(result.data.result)
      })

      api.get<Result>('/youtubeAuth/isAuthenticated').then(result => {
        setYoutube(result.data.result)
      })
    }
    loadData()
  }, [])
  const items: OptionsItem[] = []
  if (spotify !== undefined) {
    items.push({
      title: 'Spotify',
      icon: spotify ? MdDone : MdClose,
      onClick: spotifyGo
    })
  }
  if (youtube !== undefined) {
    items.push({
      title: 'Youtube',
      icon: youtube ? MdDone : MdClose,
      onClick: youtubeGo
    })
  }

  return (
    <ScreenContainer minimal lowerMargin>
      <OptionsList items={items} ulClassName="w-screen" />
    </ScreenContainer>
  )
}
