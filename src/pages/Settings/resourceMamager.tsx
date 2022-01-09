import React from 'react'
import { Helmet } from 'react-helmet'
import { MdClose, MdDone } from 'react-icons/md'

import { OptionsItem, OptionsList } from '../../components/OptionsList'
import { ScreenContainer } from '../../components/ScreenContainer'
import { useSetting } from '../../utils/settings'
import { OFFLINE_KEY, OFFLINE_PRIORITY_KEY } from '../../utils/settings/keys'

export const ResourceManagerScreen: React.FC = () => {
  const [offline, , toogleOffline] = useSetting(OFFLINE_KEY)
  const [offlinePriority, , toogleOfflinePriority] =
    useSetting(OFFLINE_PRIORITY_KEY)

  const items: OptionsItem[] = [
    {
      title: 'Recursos Offline',
      icon: offline ? MdDone : MdClose,
      description:
        'Quando ativado o sistema vai contactar o servidor de tunelamento offline.',
      onClick: toogleOffline
    },
    {
      title: 'Prioridade para Recursos Offline',
      icon: offlinePriority ? MdDone : MdClose,
      description:
        'Mesmo quando você estiver com internet o sistema vai priorizar os recursos do servidor de tunelamento offline.',
      onClick: toogleOfflinePriority
    }
  ]

  return (
    <ScreenContainer minimal lowerMargin>
      <Helmet>
        <title>Music Sync - Controle de Prioridade de Recursos na Rede</title>
      </Helmet>
      <OptionsList items={items} ulClassName="w-screen" />
    </ScreenContainer>
  )
}
