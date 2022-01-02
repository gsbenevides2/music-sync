import React from 'react'
import { Helmet } from 'react-helmet'
import { MdAdd, MdCellWifi, MdLogout, MdPlaylistAdd } from 'react-icons/md'
import { useHistory } from 'react-router'

import { OptionsItem, OptionsList } from '../../components/OptionsList'
import { ScreenContainer } from '../../components/ScreenContainer'

function SettingsScreen() {
  const history = useHistory()
  const pushToScreen = React.useCallback((screen: string) => {
    history.push(screen)
  }, [])

  const items: OptionsItem[] = [
    {
      title: 'Adicionar Música',
      icon: MdAdd,
      description: 'Coloque uma nova música a sua biblioteca.',
      onClick: () => pushToScreen('/dashboard/addMusic')
    },
    {
      title: 'Criar Playlist',
      icon: MdPlaylistAdd,
      description: 'Criar uma nova playlist.'
      // onClick:()=>
    },
    {
      title: 'Controle de Prioridade de Recursos na Rede',
      icon: MdCellWifi,
      description:
        'Controle de onde vem as músicas, e como o app vai se comportar na falta de internet.',
      onClick: () => pushToScreen('/dashboard/settings/resourceManager')
    },
    {
      title: 'Sair',
      icon: MdLogout,
      description: 'Revogue suas credenciais e saia com segurança.'
    }
  ]

  return (
    <ScreenContainer lowerMargin>
      <Helmet>
        <title>Music Sync - Configurações</title>
      </Helmet>

      <OptionsList ulClassName="relative transform pt-1.5 w-screen" items={items} />
    </ScreenContainer>
  )
}

export default SettingsScreen
