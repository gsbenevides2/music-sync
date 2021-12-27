import React from 'react'
import { MdError } from 'react-icons/md'

import api from '../../services/api/api'

interface AuthCallbackResponse {
  code: string
  message: string
  sessionId: string
  token: string
}

const AuthCallback: React.FC = () => {
  const [error, setError] = React.useState<string>()
  React.useEffect(() => {
    const url = new URL(window.location.toString())
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    if(error==='access_denied'){
      setError('Você me negou o acesso. Por favor feche essa guia e tente novamente. E dessa vez me autorize o acesso.')
    }
    else if (!code) {
      setError(
        'Por algum motivo desconhecido, o Github não enviou o código. Feche essa guia e tente novamente.'
      )
    } else {
      api
        .get<AuthCallbackResponse>(`/authCallback?code=${code}`)
        .then(response => {
          if (response.data.code === 'Authorized') {
            localStorage.setItem('sessionId', response.data.sessionId)
            localStorage.setItem('token', response.data.token)
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

export default AuthCallback
