import React from 'react'
import { Helmet } from 'react-helmet'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { fetchMusicsWithArtistAndAlbum } from '../../services/api/fetchs/musicsWithArtistAndAlbum'
import { EmptyState } from './emptyState'
import { ErrorState } from './errorState'
import { LoadingState } from './loadingState'
import { OfflineState } from './offlineState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const DashboardScreen: React.FC = () => {
  const [musics, setMusics] = React.useState<MusicWithArtistAndAlbum[]>([])
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)

  const showMessage = useMessage()

  React.useEffect(() => {
    function loadMusics(page: number) {
      fetchMusicsWithArtistAndAlbum(page)
        .then(musicsFetched => {
          setPageState('Loaded')
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
            if (page === 0 && e.response?.data?.code === 'NotFoundMusics')
              setPageState('Empty')
            else if (page > 0) showMessage('NotLoadAllMusics')
            else setPageState('Error')
          } else setPageState('Error')
        })
    }
    loadMusics(0)
  }, [])

  const musicCallback = React.useCallback(
    (id: string) => {
      const music = musics.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setMusicList(musics)
    },
    [musics]
  )

  let Content
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'Empty') Content = <EmptyState />
  else if (pageState === 'Error') Content = <ErrorState />
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
        <title>Music Sync - Dashboard</title>
      </Helmet>
      <Modal />
      <br />
      {Content}
    </div>
  )
}

export default DashboardScreen
