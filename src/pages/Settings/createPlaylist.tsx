import React from 'react'
import { Helmet } from 'react-helmet'

import Button from '../../components/Button'
import Input from '../../components/Input'
import { ScreenContainer } from '../../components/ScreenContainer'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { SuccessScreen } from '../../components/ScreenMessager/SuccessScreen'
import { useMessage } from '../../contexts/Message/index.'
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
      ev.preventDefault()
      if (navigator.onLine === false) return showMessage('Offline')
      setPageState('Loading')
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
  const Header = (
    <Helmet>
      <title>Music Sync - Criar Playlist</title>
    </Helmet>
  )
  if (pageState === 'Idle') {
    return (
      <ScreenContainer lowerMargin minimal>
        {Header}
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
        {Header}
        <LoadingScreen />
      </ScreenContainer>
    )
  } else if (pageState === 'Success') {
    return (
      <ScreenContainer lowerMargin minimal>
        {Header}
        <SuccessScreen text="Playlist criada com sucesso!" />
      </ScreenContainer>
    )
  } else {
    return (
      <ScreenContainer lowerMargin minimal>
        {Header}
        <ServerErrorScreen />
      </ScreenContainer>
    )
  }
}
