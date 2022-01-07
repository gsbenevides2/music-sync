import React from 'react'

import Button from '../../components/Button'
import Input from '../../components/Input'
import { useMessage } from '../../components/Message/index.'
import { ScreenContainer } from '../../components/ScreenContainer'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { SuccessScreen } from '../../components/ScreenMessager/SuccessScreen'
import api from '../../services/api/api'

interface Response {
  code: string
  id: string
  message: string
}

type PageState = 'Idle' | 'Loading' | 'Success'

export const CreatePlaylistScreen: React.FC = () => {
  const [name, setName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Idle')
  const showMessage = useMessage()

  const formSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    ev => {
      setPageState('Loading')
      ev.preventDefault()
      api
        .post<Response>('/playlist', { name })
        .then(response => {
          setPageState('Success')
        })
        .catch(e => {
          console.error(e)
          setPageState('Idle')
          showMessage('UnknowError')
        })
    },
    [name]
  )

  if (pageState === 'Idle') {
    return (
      <ScreenContainer lowerMargin minimal>
        <form className="w-full px-3" onSubmit={formSubmit} autoComplete="off">
          <Input
            id="name"
            label="Escolha um nome para playlist"
            setValue={setName}
            autoComplete="off"
            required
            value={name}
          />
          <Button onClick={() => {}}>Criar</Button>
        </form>
      </ScreenContainer>
    )
  } else if (pageState === 'Loading') {
    return (
      <ScreenContainer lowerMargin minimal>
        <LoadingScreen />
      </ScreenContainer>
    )
  } else if (pageState === 'Success') {
    return (
      <ScreenContainer lowerMargin minimal>
        <SuccessScreen text="Playlist criada com sucesso!" />
      </ScreenContainer>
    )
  } else {
    return (
      <ScreenContainer lowerMargin minimal>
        <ServerErrorScreen />
      </ScreenContainer>
    )
  }
}
