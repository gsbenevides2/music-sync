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
import { useActualMusicState } from '../../globalStates/states/actualMusic'
import { useMusicListState } from '../../globalStates/states/musicList'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { FetchMusics } from '../../services/api/fetchs/musics'
import { orderByPropety } from '../../utils/orderByProperty'
import { useArrayState } from '../../utils/useArrayState'

// import { MusicsResponse } from '../../services/api.types'

type PageState =
  | 'Loading'
  | 'EmptyArtist'
  | 'Error'
  | 'Loaded'
  | 'Offline'
  | 'ArtistNotFound'

type Params = { id: string }

export const ArtistScreen: React.FC = () => {
  const musicsArray = useArrayState<MusicWithArtistAndAlbum>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name'),
    equalsFunction: (a, b) => a.id === b.id
  })
  const [artistName, setArtistName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const actualMusicState = useActualMusicState()
  const musicListState = useMusicListState()

  const { id } = useParams<Params>()
  const showMessage = useMessage()
  const modal = useModal()

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchMusics<MusicWithArtistAndAlbum>({
      withAlbum: true,
      withArtist: true,
      findByArtistId: id
    })

    fetcher.addEventListener(
      'data',
      event => {
        const musicsFetched = event.detail
        setPageState('Loaded')
        setArtistName(musicsFetched[0].artist.name)
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
        else if (code === 'NotFoundMusics') setPageState('EmptyArtist')
        else if (code === 'NotLoadAllMusics') setPageState('Loaded')
        else if (code === 'ArtistNotExists') {
          setArtistName('Artista não existe')
          setPageState('ArtistNotFound')
        } else setPageState('Error')
      },
      { signal: abort.signal }
    )

    fetcher.start()
  }, [id])

  const musicCallback = React.useCallback(
    (id: string) => {
      const music = musicsArray.value.find(music => music.id === id)
      if (!music) return
      actualMusicState.set(music)
      musicListState.set(musicsArray.value)
    },
    [musicsArray.value]
  )
  React.useEffect(() => {
    const titlePage = document.getElementById('titlePage')
    if (titlePage) titlePage.innerText = artistName || 'Carregando Artista'
  }, [artistName])

  const onRightClick = React.useCallback((musicId: string) => {
    modal.openModal({ musicId }, ['AddToPlaylist', 'DeleteMusic'], () => {
      musicsArray.delete({ id: musicId } as MusicWithArtistAndAlbum)
    })
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingScreen />
  else if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'EmptyArtist')
    Content = <EmptyScreen text="Este artista não tem músicas!" />
  else if (pageState === 'Error') Content = <ServerErrorScreen />
  else if (pageState === 'ArtistNotFound')
    Content = <NotFoundScreen text="Esse artista não foi encontrado!" />
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
        <title>{artistName || 'Carregando Artista'}</title>
      </Helmet>

      <br />
      {Content}
    </ScreenContainer>
  )
}
