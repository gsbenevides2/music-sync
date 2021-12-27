import React from 'react'
import { MdAdd, MdPlaylistAdd, MdLogout } from 'react-icons/md'

const Modal: React.FC = () => {
  return (
    <div className="absolute hidden w-screen h-screen top-0 left-0 bg-black z-10 bg-opacity-75">
      <ul
        style={{ backgroundColor: '#121212' }}
        className="relative transform pt-1.5 w-9/12 h-9/12 realtive inset-1/2 transform -translate-x-1/2 -translate-y-1/2 py-1.5 rounded"
      >
        <li className="flex w-full items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
          <MdAdd size={30} />
          <div className="pl-1">
            <span>Adicionar Música</span>
            <br />
            <span className="text-sm">
              Coloque uma nova música a sua biblioteca.
            </span>
          </div>
        </li>
        <li className="flex w-full items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
          <MdPlaylistAdd size={30} />
          <div className="pl-1">
            <span>Criar Playlist</span>
            <br />
            <span className="text-sm">Criar uma nova playlist.</span>
          </div>
        </li>
        <li className="flex w-full items-center hover:bg-app-200 hover:text-app-900 pl-3 py-1.5 duration-300">
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
    </div>
  )
}

export default Modal
