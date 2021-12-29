import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { ScreenContainer } from '../../components/ScreenContainer'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { fetchMusicsByArtist } from '../../services/api/fetchs/musicsByArtist'
import { ErrorState } from '../Dashboard/errorState'
import { LoadingState } from '../Dashboard/loadingState'
import { OfflineState } from '../Dashboard/offlineState'
import { AlbumNotFound } from './albumNotFound'
import { EmptyAlbumState } from './emptyAlbumState'

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
  const [musics, setMusics] = React.useState<MusicWithArtistAndAlbum[]>([])
  const [artistName, setArtistName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  const { id } = useParams<Params>()
  const showMessage = useMessage()

  React.useEffect(() => {
    function loadMusics(page: number) {
      if (!id) return
      fetchMusicsByArtist(page, id, true, true)
        .then(musicsFetched => {
          setPageState('Loaded')
          setArtistName(musicsFetched[0].artist.name)
          setMusics(musics => {
            if (musics) return [...musics, ...musicsFetched]
            else return musicsFetched
          })
          if (musicsFetched.length === 10) loadMusics(page + 1)
        })
        .catch(e => {
          const code = e.response?.data?.code || e.code || ''
          if (code === 'Offline') setPageState('Offline')
          else if (code === 'NotMoreError') setPageState('Loaded')
          else if (code === 'SessionNotFound' || code === 'TokenInvalid')
            showMessage(code)
          else if (page === 0 && code === 'NotFoundMusics')
            setPageState('EmptyArtist')
          else if (page > 0 && code !== 'NotFoundMusics')
            showMessage('NotLoadAllMusics')
          else if (page > 0 && code === 'NotFoundMusics') setPageState('Loaded')
          else if (code === 'ArtistNotExists') {
            setArtistName('Artista não existe')
            setPageState('ArtistNotFound')
          } else setPageState('Error')
        })
    }
    loadMusics(0)
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
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'EmptyArtist') Content = <EmptyAlbumState />
  else if (pageState === 'Error') Content = <ErrorState />
  else if (pageState === 'ArtistNotFound') Content = <AlbumNotFound />
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
        <title>{artistName || 'Carregando Artista'}</title>
      </Helmet>
      <Modal />
      <br />
      {Content}
    </ScreenContainer>
  )
}
