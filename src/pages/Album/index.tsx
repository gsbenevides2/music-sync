import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { fetchMusicsByAlbum } from '../../services/api/fetchs/musicsByAlbum'
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
  const [musics, setMusics] = React.useState<MusicWithArtistAndAlbum[]>([])
  const [albumName, setAlbumName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  const { id } = useParams<Params>()
  const showMessage = useMessage()

  React.useEffect(() => {
    function loadMusics(page: number) {
      if (!id) return
      fetchMusicsByAlbum(page, id, true, true)
        .then(musicsFetched => {
          setPageState('Loaded')
          setAlbumName(musicsFetched[0].album.name)
          setMusics(musics => {
            if (musics) return [...musics, ...musicsFetched]
            else return musicsFetched
          })
          if (musicsFetched.length === 10) loadMusics(page + 1)
        })
        .catch(e => {
          if (e.code) {
            if (e.code === 'Offline') setPageState('Offline')
            else if (e.code === 'NotMoreError') setPageState('Loaded')
            else setPageState('Error')
          } else if (e.response?.data?.code) {
            if (
              e.response.data.code === 'SessionNotFound' ||
              e.response.data.code === 'TokenInvalid'
            )
              showMessage(e.response.data.code)
            else if (page === 0 && e.response?.data?.code === 'NotFoundMusics')
              setPageState('EmptyAlbum')
            else if (page > 0) showMessage('NotLoadAllMusics')
            else if (e.response.data.code === 'AlbumNotExists') {
              setAlbumName('Album não existe')
              setPageState('AlbumNotFound')
            } else setPageState('Error')
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
      <>
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
        <p style={{ height: '12vh' }} />
      </>
    )
  }

  return (
    <div>
      <Helmet>
        <title>{albumName || 'Carregando Album'}</title>
      </Helmet>
      <Modal />
      <br />
      {Content}
    </div>
  )
}
