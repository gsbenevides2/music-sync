import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'

import { screens } from './screen'

const pages = screens.filter(screen => screen.name)

const Menu: React.FC = () => {
  const history = useHistory()

  const lis = pages.map(page => (
    <li
      key={page.path}
      onClick={() => history.push(page.path)}
      className={`flex justify-center items-center border rounded p-1 duration-300 ${
        useRouteMatch({ exact: true, path: page.path })
          ? 'border-app-400 text-app-400'
          : 'hover:border-app-400 hover:text-app-400 cursor-pointer'
      }`}
    >
      {page.icon ? page.icon({}) : null}
      <span className="pl-1">{page.name}</span>
    </li>
  ))

  return (
    <ul className="flex gap-1 overflow-x-scroll hiden-scroll pt-1">{lis}</ul>
  )
}

export default Menu
