import React from 'react'
import { MdClose, MdDone } from 'react-icons/md'

import { ScreenContainer } from '../../components/ScreenContainer'
import { useSetting } from '../../utils/settings'
import { OFFLINE_KEY, OFFLINE_PRIORITY_KEY } from '../../utils/settings/keys'

export const ResourceManagerScreen: React.FC = () => {
  const [offline, , toogleOffline] = useSetting(OFFLINE_KEY)
  const [offlinePriority, , toogleOfflinePriority] =
    useSetting(OFFLINE_PRIORITY_KEY)

  return (
    <ScreenContainer minimal lowerMargin>
      <ul>
        <li
          onClick={toogleOffline}
          className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300"
        >
          <div>{offline ? <MdDone size={30} /> : <MdClose size={30} />}</div>
          <div className="px-3">
            <span>Recursos Offline</span>
            <br />
            <span className="text-sm">
              Quando ativado o sistema vai contactar o servidor de tunelamento
              offline.
            </span>
          </div>
        </li>
        <li
          onClick={toogleOfflinePriority}
          className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300"
        >
          <div>
            {offlinePriority ? <MdDone size={30} /> : <MdClose size={30} />}
          </div>
          <div className="px-3">
            <span>Prioridade para Recursos Offline</span>
            <br />
            <span className="text-sm">
              Mesmo quando você estiver com internet o sistema vai priorizar os
              recursos do servidor de tunelamento offline.
            </span>
          </div>
        </li>
      </ul>
    </ScreenContainer>
  )
}
