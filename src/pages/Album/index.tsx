import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { ScreenContainer } from '../../components/ScreenContainer'
import { EmptyScreen } from '../../components/ScreenMessager/EmptyScreen'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { NotFoundScreen } from '../../components/ScreenMessager/NotFoundScreen'
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

type PageState =
  | 'Loading'
  | 'EmptyAlbum'
  | 'Error'
  | 'Loaded'
  | 'Offline'
  | 'AlbumNotFound'

type Params = { id: string }

export const AlbumScreen: React.FC = () => {
  const musicsArray = useArrayState<MusicWithArtistAndAlbum>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name'),
    equalsFunction: (a, b) => a.id === b.id
  })
  const [albumName, setAlbumName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  const { id } = useParams<Params>()
  const showMessage = useMessage()
  const modal = useModal()

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchMusics<MusicWithArtistAndAlbum>({
      withAlbum: true,
      withArtist: true,
      findByAlbumId: id
    })

    fetcher.addEventListener(
      'data',
      event => {
        const musicsFetched = event.detail
        setPageState('Loaded')
        setAlbumName(musicsFetched[0].album.name)
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
        else if (code === 'NotFoundMusics') setPageState('EmptyAlbum')
        else if (code === 'NotLoadAllMusics') setPageState('Loaded')
        else if (code === 'AlbumNotExists') {
          setAlbumName('Album não existe')
          setPageState('AlbumNotFound')
        } else setPageState('Error')
      },
      { signal: abort.signal }
    )

    fetcher.start()
  }, [id])

  const musicCallback = React.useCallback(
    (id: string) => {
      const music = musicsArray.value.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setValue(musicsArray.value)
    },
    [musicsArray.value]
  )

  React.useEffect(() => {
    const titlePage = document.getElementById('titlePage')
    if (titlePage) titlePage.innerText = albumName || 'Carregando Album'
  }, [albumName])

  const onRightClick = React.useCallback((musicId: string) => {
    modal.openModal({ musicId }, ['AddToPlaylist', 'DeleteMusic'], () => {
      musicsArray.delete({ id: musicId } as MusicWithArtistAndAlbum)
    })
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingScreen />
  else if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'EmptyAlbum')
    Content = <EmptyScreen text="Este album não tem músicas." />
  else if (pageState === 'Error') Content = <ServerErrorScreen />
  else if (pageState === 'AlbumNotFound')
    Content = <NotFoundScreen text="Esse album não existe!" />
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
        onClick={musicCallback}
        onRightClick={onRightClick}
        minimal
        lowerMargin
      />
    )
  }

  return (
    <ScreenContainer minimal>
      <Helmet>
        <title>{albumName || 'Carregando Album'}</title>
      </Helmet>

      <br />
      {Content}
    </ScreenContainer>
  )
}
