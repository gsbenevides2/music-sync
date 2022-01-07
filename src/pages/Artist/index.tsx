import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import { ScreenContainer } from '../../components/ScreenContainer'
import { EmptyScreen } from '../../components/ScreenMessager/EmptyScreen'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { NotFoundScreen } from '../../components/ScreenMessager/NotFoundScreen'
import { OfflineScreen } from '../../components/ScreenMessager/OfflineScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
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
  const [musics, , appendMusics] = useArrayState<MusicWithArtistAndAlbum>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name')
  })
  const [artistName, setArtistName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  const { id } = useParams<Params>()
  const showMessage = useMessage()

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
      const music = musics.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setMusicList(musics)
    },
    [musics]
  )
  React.useEffect(() => {
    const titlePage = document.getElementById('titlePage')
    if (titlePage) titlePage.innerText = artistName || 'Carregando Artista'
  }, [artistName])

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
        listOfItems={musics.map(music => {
          return {
            id: music.id,
            title: music.name,
            subtitle: music.artist.name,
            imageSrc: music.album.spotifyCoverUrl
          }
        })}
        onClick={musicCallback}
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
