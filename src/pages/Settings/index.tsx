import React from 'react'
import { Helmet } from 'react-helmet'
import { MdAdd, MdLogout, MdPlaylistAdd } from 'react-icons/md'
import { useHistory } from 'react-router'

import { ScreenContainer } from '../../components/ScreenContainer'

function SettingsScreen() {
  const history = useHistory()
  const goToAddMusicScreen = React.useCallback(() => {
    history.push('/dashboard/addMusic')
  }, [])
  return (
    <ScreenContainer lowerMargin>
      <Helmet>
        <title>Music Sync - Configurações</title>
      </Helmet>
      <ul className="relative transform pt-1.5">
        <li
          onClick={goToAddMusicScreen}
          className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300"
        >
          <MdAdd size={30} />
          <div className="pl-1">
            <span>Adicionar Música</span>
            <br />
            <span className="text-sm">
              Coloque uma nova música a sua biblioteca.
            </span>
          </div>
        </li>
        <li className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
          <MdPlaylistAdd size={30} />
          <div className="pl-1">
            <span>Criar Playlist</span>
            <br />
            <span className="text-sm">Criar uma nova playlist.</span>
          </div>
        </li>
        <li className="flex w-screen items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
          <MdLogout size={30} />
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
