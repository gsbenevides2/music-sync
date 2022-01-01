import React from 'react'
import { Helmet } from 'react-helmet'
import { MdAdd, MdCellWifi, MdLogout, MdPlaylistAdd } from 'react-icons/md'
import { useHistory } from 'react-router'

import { ScreenContainer } from '../../components/ScreenContainer'

function SettingsScreen() {
  const history = useHistory()
  const pushToScreen = React.useCallback((screen: string) => {
    history.push(screen)
  }, [])
  return (
    <ScreenContainer lowerMargin>
      <Helmet>
        <title>Music Sync - Configurações</title>
      </Helmet>
      <ul className="relative transform pt-1.5">
        <li
          onClick={() => {
            pushToScreen('/dashboard/addMusic')
          }}
          className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300"
        >
          <div>
            <MdAdd size={30} />
          </div>
          <div className="pl-1">
            <span>Adicionar Música</span>
            <br />
            <span className="text-sm">
              Coloque uma nova música a sua biblioteca.
            </span>
          </div>
        </li>
        <li className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
          <div>
            <MdPlaylistAdd size={30} />
          </div>
          <div className="pl-1">
            <span>Criar Playlist</span>
            <br />
            <span className="text-sm">Criar uma nova playlist.</span>
          </div>
        </li>
        <li
          className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300"
          onClick={() => {
            pushToScreen('/dashboard/settings/resourceManager')
          }}
        >
          <div>
            <MdCellWifi size={30} />
          </div>
          <div className="pl-1">
            <span>Controle de Prioridade de Recursos na Rede </span>
            <br />
            <span className="text-sm">
              Controle de onde vem as músicas, e como o app vai se comportar na
              falta de internet.
            </span>
          </div>
        </li>
        <li className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
          <div>
            <MdLogout size={30} />
          </div>
          <div className="pl-1">
            <span>Sair</span>
            <br />
            <span className="text-sm">
              Revogue suas credenciais e saia com segurança.
            </span>
          </div>
        </li>
      </ul>
    </ScreenContainer>
  )
}

export default SettingsScreen
