import React from 'react'
import { Helmet } from 'react-helmet'

import LaggerList from '../../components/LaggerList'
import { ScreenContainer } from '../../components/ScreenContainer'
import { EmptyScreen } from '../../components/ScreenMessager/EmptyScreen'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { OfflineScreen } from '../../components/ScreenMessager/OfflineScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { useMessage } from '../../contexts/Message/index.'
import { useModal } from '../../contexts/Modal'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { FetchMusics } from '../../services/api/fetchs/musics'
import { orderByPropety } from '../../utils/orderByProperty'
import { useArrayState } from '../../utils/useArrayState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const DashboardScreen: React.FC = () => {
  const modal = useModal()

  const musicsArray = useArrayState<MusicWithArtistAndAlbum>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name'),
    equalsFunction: (a, b) => a.id === b.id
  })
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
        musicsArray.append(musicsFetched)
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
      const music = musicsArray.value.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setMusicList(musicsArray.value)
    },
    [musicsArray.value]
  )
  const onRightClick = React.useCallback((id: string) => {
    modal.openModal(id, ['AddToPlaylist', 'DeleteMusic'], () => {
      musicsArray.delete({ id } as MusicWithArtistAndAlbum)
    })
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingScreen />
  else if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'Empty')
    Content = (
      <EmptyScreen text="Você ainda não adicionou músicas.\nTente ir nas configurações!" />
    )
  else if (pageState === 'Error') Content = <ServerErrorScreen />
  else if (pageState === 'Loaded') {
    Content = (
      <LaggerList
        listOfItems={musicsArray.value.map(music => {
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

      {Content}
    </ScreenContainer>
  )
}

export default DashboardScreen
