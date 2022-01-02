import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import { ScreenContainer } from '../../components/ScreenContainer'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { FetchMusics } from '../../services/api/fetchs/musics'
import { useArrayState } from '../../utils/useArrayState'
import { ErrorState } from '../Dashboard/errorState'
import { LoadingState } from '../Dashboard/loadingState'
import { OfflineState } from '../Dashboard/offlineState'
import { AlbumNotFound } from './albumNotFound'
import { EmptyAlbumState } from './emptyAlbumState'

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
  const [musics, , appendMusics] = useArrayState<MusicWithArtistAndAlbum>([])
  const [albumName, setAlbumName] = React.useState<string>()
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
      findByAlbumId: id
    })

    fetcher.addEventListener(
      'data',
      event => {
        const musicsFetched = event.detail
        setPageState('Loaded')
        setAlbumName(musicsFetched[0].album.name)
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
      const music = musics.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setMusicList(musics)
    },
    [musics]
  )
  React.useEffect(() => {
    const titlePage = document.getElementById('titlePage')
    if (titlePage) titlePage.innerText = albumName || 'Carregando Album'
  }, [albumName])

  let Content
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'EmptyAlbum') Content = <EmptyAlbumState />
  else if (pageState === 'Error') Content = <ErrorState />
  else if (pageState === 'AlbumNotFound') Content = <AlbumNotFound />
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
