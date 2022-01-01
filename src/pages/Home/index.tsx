import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import api from '../../services/api/api'
import { getSettingString } from '../../utils/settings'
import { SESSION_ID_KEY, TOKEN_KEY } from '../../utils/settings/keys'

function HomeScreen() {
  const history = useHistory()

  const goToDashboard = React.useCallback(async () => {
    api
      .get('/auth')
      .then(response => {
        const url = response.data as string
        window.open(url)
        const interval = setInterval(() => {
          const sessionId = getSettingString(SESSION_ID_KEY)
          const token = getSettingString(TOKEN_KEY)
          if (sessionId && token) {
            clearInterval(interval)
            history.push('/dashboard')
          }
        }, 1000)
      })
      .catch(() => {
        alert('Ocorreu um erro desconhecido!')
      })
  }, [])
  React.useEffect(() => {
    const sessionId = getSettingString(SESSION_ID_KEY)
    const token = getSettingString(TOKEN_KEY)
    if (sessionId && token) {
      history.push('/dashboard')
    }
  }, [])
  return (
    <>
      <Helmet>
        <title>Music Sync - Bem Vindo</title>
      </Helmet>
      <div className="bg-home-back bg-cover filter blur-md h-screen w-screen" />
      <div className="absolute flex flex-col items-center h-screen flex-1 justify-center top-0 w-screen text-white p-2">
        <h1 className="text-3xl text-center">Seja bem-vindo ao Music Sync</h1>
        <p className="max-w-sm text-center">
          Sincronize e baixe suas músicas e playlists, entre Youtube e Spotify.
        </p>
        <button
          onClick={goToDashboard}
          className="hover:bg-app-600 p-2 rounded-md m-2.5 duration-150 bg-app-600 text-white hover:text-black"
        >
          Fazer Login
        </button>
      </div>
    </>
  )
}

export default HomeScreen
