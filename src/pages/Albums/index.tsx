import React from 'react'
import { Helmet } from 'react-helmet'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { Album } from '../../services/api/apiTypes'
import { fetchAlbums } from '../../services/api/fetchs/albums'
import { ErrorState } from '../Dashboard/errorState'
import { LoadingState } from '../Dashboard/loadingState'
import { OfflineState } from '../Dashboard/offlineState'
import { EmptyState } from './emptyState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const AlbumsScreen: React.FC = () => {
  const [albums, setAlbums] = React.useState<Album[]>([])
  const [pageState, setPageState] = React.useState<PageState>('Loading')

  const showMessage = useMessage()

  React.useEffect(() => {
    function loadAlbums(page: number) {
      fetchAlbums(page)
        .then(albumsFetched => {
          setPageState('Loaded')
          setAlbums(albums => {
            if (albums) return [...albums, ...albumsFetched]
            else return albumsFetched
          })
          if (albumsFetched.length === 10) loadAlbums(page + 1)
        })
        .catch(e => {
          if (e.code) {
            if (e.code === 'Offline') setPageState('Offline')
            else if (e.code === 'NotMoreError') setPageState('Loaded')
            else setPageState('Error')
          } else if (e.response?.data?.code) {
            if (page === 0 && e.response?.data?.code === 'NotFoundAlbums')
              setPageState('Empty')
            else if (page > 0) showMessage('NotLoadAllAlbums')
            else setPageState('Error')
          } else setPageState('Error')
        })
    }
    loadAlbums(0)
  }, [])
  /*
  const musicCallback = React.useCallback(
    (id: string) => {
      const music = albums.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setMusicList(albums)
    },
    [albums]
  )
*/
  let Content
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'Empty') Content = <EmptyState />
  else if (pageState === 'Error') Content = <ErrorState />
  else if (pageState === 'Loaded') {
    Content = (
      <>
        <LaggerList
          listOfItems={albums.map(album => {
            return {
              id: album.id,
              title: album.name,
              imageSrc: album.spotifyCoverUrl
            }
          })}
        />
        <p style={{ height: '12vh' }} />
      </>
    )
  }

  return (
    <div>
      <Helmet>
        <title>Music Sync - Todos os Albums</title>
      </Helmet>
      <Modal />
      <br />
      {Content}
    </div>
  )
}

export default AlbumsScreen
