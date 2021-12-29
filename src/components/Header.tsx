import React from 'react'
import { MdArrowBack } from 'react-icons/md'
import { useHistory, useRouteMatch } from 'react-router'

import CircleButton from './CircleButton'
import Menu from './Menu'

interface Props {
  title: string
}

const screens = {
  '/dashboard': {
    title: 'Seja Bem Vindo Guilherme🎧',
    showMenu: true,
    showBack: false
  },
  '/dashboard/artists': {
    title: 'Todos os Artistas',
    showMenu: true,
    showBack: false
  },
  '/dashboard/albums': {
    title: 'Todos os Albums',
    showMenu: true,
    showBack: false
  },
  '/dashboard/settings': {
    title: 'Configurações',
    showMenu: true,
    showBack: false
  },
  '/dashboard/addMusic': {
    title: 'Adicionar Música',
    showMenu: false,
    showBack: true
  },
  '/dashboard/album/:id': {
    title: 'Carregando Album',
    showMenu: false,
    showBack: true
  },
  '/dashboard/artist/:id': {
    title: 'Carregando Artista',
    showMenu: false,
    showBack: true
  }
}

const Header: React.FC<Props> = props => {
  const history = useHistory()
  const screenData = Object.entries(screens).find(screen => {
    return useRouteMatch({ path: screen[0], exact: true })
  })

  const goBack = React.useCallback(() => {
    history.goBack()
  }, [])
  console.log(screenData)
  if (screenData) {
    return (
      <div className="fixed z-20 w-full pt-3 pl-3" style={{ backgroundColor: '#121212' }}>
        <div className="flex flex-column gap-1">
          {screenData[1].showBack ? (
            <CircleButton small onClick={goBack}>
              <MdArrowBack />
            </CircleButton>
          ) : null}
          <h1 className="text-xl" id="titlePage">
            {screenData[1].title}
          </h1>
        </div>

        {screenData[1].showMenu === true ? (
          <>
            <h2>O que ouviremos agora?</h2>
            <Menu />
          </>
        ) : null}
      </div>
    )
  } else return <></>
}

export default Header
