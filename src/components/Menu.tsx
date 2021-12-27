import React from 'react'
import { MdAlbum, MdHome, MdPerson, MdSettings } from 'react-icons/md'
import { useHistory } from 'react-router'

const Menu: React.FC = () => {
  const history = useHistory()
  const pathname = history.location.pathname
  const goToAlbums = React.useCallback(() => {
    history.push('/dashboard/albums')
  }, [])
  const goToArtists = React.useCallback(() => {
    history.push('/dashboard/artists')
  }, [])
  const goToSettings = React.useCallback(() => {
    history.push('/dashboard/settings')
  }, [])

  const goToHome = React.useCallback(() => {
    history.push('/dashboard')
  }, [])
  return (
    <ul className="flex gap-1 overflow-x-scroll hiden-scroll pt-1">
      <li
        onClick={goToHome}
        className={`flex justify-center items-center border rounded p-1 duration-300 ${
          pathname === '/dashboard'
            ? 'border-app-400 text-app-400'
            : 'hover:border-app-400 hover:text-app-400 cursor-pointer'
        }`}
      >
        <MdHome />
        <span className="pl-1">Home</span>
      </li>
      <li
        onClick={goToArtists}
        className={`flex justify-center items-center border rounded p-1 duration-300 ${
          pathname === '/dashboard/artists'
            ? 'border-app-400 text-app-400'
            : 'hover:border-app-400 hover:text-app-400 cursor-pointer'
        }`}
      >
        <MdPerson />
        <span className="pl-1">Artistas</span>
      </li>
      <li
        onClick={goToAlbums}
        className={`flex justify-center items-center border rounded p-1 duration-300 ${
          pathname === '/dashboard/albums'
            ? 'border-app-400 text-app-400'
            : 'hover:border-app-400 hover:text-app-400 cursor-pointer'
        }`}
      >
        <MdAlbum />
        <span className="pl-1">Albums</span>
      </li>
      <li
        onClick={goToSettings}
        className={`flex justify-center items-center border rounded p-1 duration-300 ${
          pathname === '/dashboard/settings'
            ? 'border-app-400 text-app-400'
            : 'hover:border-app-400 hover:text-app-400 cursor-pointer'
        }`}
      >
        <MdSettings />
        <span className="pl-1">Configurações</span>
      </li>
    </ul>
  )
}

export default Menu
