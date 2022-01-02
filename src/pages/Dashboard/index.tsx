import React from 'react'
import { Helmet } from 'react-helmet'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal, { ModalEvents, useModal } from '../../components/Modal'
import { ScreenContainer } from '../../components/ScreenContainer'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { FetchMusics } from '../../services/api/fetchs/musics'
import { useArrayState } from '../../utils/useArrayState'
import { EmptyState } from './emptyState'
import { ErrorState } from './errorState'
import { LoadingState } from './loadingState'
import { OfflineState } from './offlineState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const DashboardScreen: React.FC = () => {
  const modal = useModal(['AddToPlaylist', 'DeleteMusic'])
  const [musics, , appendMusics] = useArrayState<MusicWithArtistAndAlbum>([])
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)

  const showMessage = useMessage()

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchMusics<MusicWithArtistAndAlbum>({
      withAlbum: true,
      withArtist: true
    })

    fetcher.addEventListener(
      'data',
      event => {
        const musicsFetched = event.detail
        setPageState('Loaded')
        appendMusics(musicsFetched, (a, b) => a.id === b.id)
      },
      { signal: abort.signal }
    )
    fetcher.addEventListener(
      'error',
      event => {
        const code = event.detail

        if (code === 'Offline') setPageState('Offline')
        else if (code === 'SessionNotFound' || code === 'TokenInvalid')
          showMessage(code)
        else if (code === 'NotFoundMusics') setPageState('Empty')
        else if (code === 'NotLoadAllMusics') setPageState('Loaded')
        else setPageState('Error')
      },
      { signal: abort.signal }
    )

    fetcher.start()
  }, [])

  const onClickCallback = React.useCallback(
    (id: string) => {
      const music = musics.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setMusicList(musics)
    },
    [musics]
  )
  const onRightClick = React.useCallback(
    (id: string) => {
      modal.setOpen(true)
    },
    [musics]
  )

  const onModalEvent = React.useCallback((event: ModalEvents) => {
    console.log(event)
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'Empty') Content = <EmptyState />
  else if (pageState === 'Error') Content = <ErrorState />
  else if (pageState === 'Loaded') {
    Content = (
      <LaggerList
        listOfItems={musics.map(music => {
          return {
            id: music.id,
            title: music.name,
            subtitle: music.artist.name,
            imageSrc: music.album.spotifyCoverUrl
          }
        })}
        onClick={onClickCallback}
        onRightClick={onRightClick}
      />
    )
  }

  return (
    <ScreenContainer>
      <Helmet>
        <title>Music Sync - Dashboard</title>
      </Helmet>
      <Modal {...modal.props} onEvent={onModalEvent} />
      {Content}
    </ScreenContainer>
  )
}

export default DashboardScreen
