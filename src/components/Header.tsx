import React from 'react'
import { MdArrowBack } from 'react-icons/md'
import { useHistory } from 'react-router'

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
  }
}

type Screens = typeof screens

const Header: React.FC<Props> = props => {
  const history = useHistory()
  const pathname = history.location.pathname as keyof Screens

  const goBack = React.useCallback(() => {
    history.goBack()
  }, [])
  return (
    <>
      <div className="flex flex-column gap-1">
        {screens[pathname].showBack ? (
          <CircleButton small onClick={goBack}>
            <MdArrowBack />
          </CircleButton>
        ) : null}
        <h1 className="text-xl">{screens[pathname].title}</h1>
      </div>

      {screens[pathname].showMenu === true ? (
        <>
          <h2>O que ouviremos agora?</h2>
          <Menu />
        </>
      ) : null}
    </>
  )
}

export default Header
