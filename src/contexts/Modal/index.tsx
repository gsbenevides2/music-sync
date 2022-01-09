import React from 'react'
import {
  MdPlaylistAdd,
  MdDelete,
  MdClose,
  MdPlaylistAddCheck
} from 'react-icons/md'
import { animated, useSpring } from 'react-spring'

import { OptionsItem, OptionsList } from '../../components/OptionsList'
import { FetchPlaylists } from '../../services/api/fetchs/playlists'
import { useMessage } from '../Message/index.'
import { addToPlaylist } from './AddToPlaylist'
import { DeleteMusic } from './DeleteMusic'

export type ModalOptions = 'DeleteMusic' | 'AddToPlaylist'

interface ModalState {
  opened: boolean
  options: ModalOptions[]
  musicId?: string
  selectPlaylist: boolean
  reloadScreen?: () => void
}

const initialState: ModalState = {
  opened: false,
  options: [],
  selectPlaylist: false
}

interface ModalContextInterface {
  state: ModalState
  setState?: React.Dispatch<React.SetStateAction<ModalState>>
}

const ModalContext = React.createContext<ModalContextInterface>({
  state: initialState
})

export const ModalProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<ModalState>(initialState)
  const [items, setItems] = React.useState<OptionsItem[]>([])
  const showMessage = useMessage()

  const [stylesToModalAnimation, modalAnimation] = useSpring(() => ({
    opacity: 0,
    display: 'none'
  }))

  React.useEffect(() => {
    if (state.opened) {
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

    const items: OptionsItem[] = []
    if (state.selectPlaylist) {
      setItems(items)
      const abortController = new AbortController()

      const fetcher = new FetchPlaylists()
      fetcher.addEventListener(
        'data',
        event => {
          setItems(
            event.detail.map(playlist => {
              return {
                title: playlist.name,
                icon: MdPlaylistAddCheck,
                onClick: () => {
                  addToPlaylist(playlist.id, state.musicId as string).then(
                    () => {
                      showMessage('MusicAddedToPlaylist')
                      setState(initialState)
                    }
                  )
                }
              }
            })
          )
        },
        { signal: abortController.signal }
      )
      fetcher.start()
    } else {
      if (state.options.includes('AddToPlaylist')) {
        items.push({
          title: 'Adicionar a uma Playlist',
          description: 'Adiciona essa música a uma plalist previamente criada.',
          icon: MdPlaylistAdd,
          onClick: () => {
            setState({
              ...state,
              selectPlaylist: true
            })
          }
        })
      }

      if (state.options.includes('DeleteMusic')) {
        items.push({
          title: 'Deletar Música',
          description: 'Deleta a música para sempre.',
          icon: MdDelete,
          onClick: () => {
            DeleteMusic(state.musicId as string).then(() => {
              state.reloadScreen?.()
              setState(initialState)
              showMessage('MusicDeleted')
            })
          }
        })
      }
      setItems(items)
    }
  }, [state])

  return (
    <ModalContext.Provider value={{ state, setState }}>
      <animated.div
        style={stylesToModalAnimation}
        className="absolute w-screen h-screen top-0 left-0 bg-black z-50 bg-opacity-75"
      >
        <div className="relative transform pt-2 w-9/12 h-9/12 realtive inset-1/2 transform -translate-x-1/2 -translate-y-1/2 py-1.5 rounded background-app-color">
          <div className="flex justify-between items-center pl-3 pr-2 pb-2">
            <h2>Escolha uma opção:</h2>
            <MdClose size={20} onClick={() => setState(initialState)} />
          </div>
          <OptionsList items={items} />
        </div>
      </animated.div>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const { setState } = React.useContext(ModalContext)

  const openModal = (
    id: string,
    options: ModalOptions[],
    reloadScreen: () => void
  ) => {
    setState?.({
      opened: true,
      options,
      reloadScreen,
      musicId: id,
      selectPlaylist: false
    })
  }

  return { openModal }
}

/*

export type ModalEvents = 'DeleteMusic' | 'AddToPlaylist'

interface Props {
  open: boolean
  close: () => void
  events: Array<ModalEvents>
  onEvent: (type: ModalEvents) => void
}

export const useModal = (events: Array<ModalEvents>) => {
  const [open, setOpen] = React.useState(false)
  const [id, setId] = React.useState<string>()
  const toogleModal = React.useCallback(() => {
    setOpen(o => !o)
  }, [])

  const openModal = React.useCallback((id: string) => {
    setOpen(true)
    setId(id)
  }, [])

  const closeModal = React.useCallback(() => {
    setOpen(false)
  }, [])
  const eventHandle = React.useCallback((events: ModalEvents) => {}, [id])

  return {
    props: {
      open,
      events,
      close: () => closeModal
    },
    openModal,
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

*/
