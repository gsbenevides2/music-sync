import React from 'react'
import { MdError } from 'react-icons/md'

import api from '../../services/api/api'
import { setSetting } from '../../utils/settings'
import { AUTH_WAITING_KEY } from '../../utils/settings/keys'

const YoutubeCallback: React.FC = () => {
  const [error, setError] = React.useState<string>()
  React.useEffect(() => {
    const url = new URL(window.location.toString())
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    if (error === 'access_denied') {
      setError('Você me negou o acesso. Por favor feche essa guia e tente novamente. E dessa vez me autorize o acesso.')
    }
    else if (!code) {
      setError(
        'Por algum motivo desconhecido, o Github não enviou o código. Feche essa guia e tente novamente.'
      )
    } else {
      api
        .get<string>(`/youtubeAuth/callback?code=${code}&state=${state}`)
        .then(response => {
          if (response.data === 'OK') {
            setSetting(AUTH_WAITING_KEY, 'ok')
            window.close()
          } else {
            console.error(response)
            setError(
              'Ocorreu um erro. Feche essa guia e tente novamente.'
            )
          }
        })
        .catch(error => {
          console.error(error)
          setError(
            'Ocorreu um erro. Feche essa guia e tente novamente.'
          )
        })
    }
  }, [])
  if (error) {
    return (
      <div className="flex flex-col items-center mt-3">
        <MdError size={66} color="red" />
        <h1 className="max-w-xl text-center text-2xl">{error}</h1>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center mt-3">
        <div className="loader"></div>
        <h1 className="max-w-xl text-center text-2xl">Aguarde</h1>
      </div>
    )
  }
}

export default YoutubeCallback
