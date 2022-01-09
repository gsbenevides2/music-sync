import React from 'react'
import { MdArrowBack } from 'react-icons/md'
import { useHistory, useRouteMatch } from 'react-router'

import CircleButton from '../CircleButton'
import Menu from './Menu'
import { screens } from './screen'

interface Props {
  title: string
}

const Header: React.FC<Props> = props => {
  const history = useHistory()
  const screenData = screens.find(screen => {
    return useRouteMatch({ path: screen.path, exact: true })
  })

  const goBack = React.useCallback(() => {
    history.goBack()
  }, [])

  if (screenData) {
    return (
      <div
        className="fixed z-20 w-full pt-3 px-3"
        style={{ backgroundColor: '#121212' }}
      >
        <div className="flex flex-column gap-1">
          {screenData.showBack ? (
            <CircleButton small onClick={goBack}>
              <MdArrowBack />
            </CircleButton>
          ) : null}
          <h1 className="text-xl truncate" id="titlePage">
            {screenData.title}
          </h1>
        </div>

        {screenData.showMenu === true ? (
          <>
            <h2 className="truncate">O que ouviremos agora?</h2>
            <Menu />
          </>
        ) : null}
      </div>
    )
  } else return <></>
}

export default Header
