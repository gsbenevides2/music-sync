import React from 'react'
import { MdPlaylistAdd, MdDelete, MdClose } from 'react-icons/md'
import { animated, useSpring } from 'react-spring'

import { OptionsItem, OptionsList } from './OptionsList'

export type ModalEvents = 'DeleteMusic' | 'AddToPlaylist'

interface Props {
  open: boolean
  close: () => void
  events: Array<ModalEvents>
  onEvent: (type: ModalEvents) => void
}

export const useModal = (events: Array<ModalEvents>) => {
  const [open, setOpen] = React.useState(false)
  const toogleModal = React.useCallback(() => {
    setOpen(o => !o)
  }, [])
  return {
    props: {
      open,
      events,
      close: () => setOpen(false)
    },
    setOpen,
    toogleModal
  }
}

const Modal: React.FC<Props> = props => {
  const [stylesToModalAnimation, modalAnimation] = useSpring(() => ({
    opacity: 0,
    display: 'none'
  }))

  React.useEffect(() => {
    if (props.open) {
      modalAnimation.start(() => ({
        opacity: 1,
        display: 'block'
      }))
    } else {
      modalAnimation.start(() => ({
        opacity: 0,
        onResolve: () => {
          modalAnimation.start(() => ({
            display: 'none'
          }))
        }
      }))
    }
  }, [props.open])

  const items: OptionsItem[] = []

  if (props.events.includes('AddToPlaylist')) {
    items.push({
      title: 'Adicionar a uma Playlist',
      description: 'Adiciona essa música a uma plalist previamente criada.',
      icon: MdPlaylistAdd,
      onClick: () => {
        props.close()
        props.onEvent('AddToPlaylist')
      }
    })
  }

  if (props.events.includes('DeleteMusic')) {
    items.push({
      title: 'Deletar Música',
      description: 'Deleta a música para sempre.',
      icon: MdDelete,
      onClick: () => {
        props.close()
        props.onEvent('DeleteMusic')
      }
    })
  }

  return (
    <animated.div
      style={stylesToModalAnimation}
      className="absolute w-screen h-screen top-0 left-0 bg-black z-50 bg-opacity-75"
    >
      <div className="relative transform pt-2 w-9/12 h-9/12 realtive inset-1/2 transform -translate-x-1/2 -translate-y-1/2 py-1.5 rounded background-app-color">
        <div className="flex justify-between items-center pl-3 pr-2 pb-2">
          <h2>Escolha uma opção:</h2>
          <MdClose size={20} onClick={props.close} />
        </div>
        <OptionsList items={items} />
      </div>
    </animated.div>
  )
}

export default Modal
