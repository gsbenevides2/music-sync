import React from 'react'
import { Helmet } from 'react-helmet'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { Artist } from '../../services/api/apiTypes'
import { fetchArtists } from '../../services/api/fetchs/artists'
import { ErrorState } from '../Dashboard/errorState'
import { LoadingState } from '../Dashboard/loadingState'
import { OfflineState } from '../Dashboard/offlineState'
import { EmptyState } from './emptyState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const ArtistsScreen: React.FC = () => {
  const [artists, setArtists] = React.useState<Artist[]>([])
  const [pageState, setPageState] = React.useState<PageState>('Loading')

  const showMessage = useMessage()

  React.useEffect(() => {
    function loadArtists(page: number) {
      fetchArtists(page)
        .then(artistsFetched => {
          setPageState('Loaded')
          setArtists(artists => {
            if (artists) return [...artists, ...artistsFetched]
            else return artistsFetched
          })
          if (artistsFetched.length === 10) loadArtists(page + 1)
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
            else if (page === 0 && e.response?.data?.code === 'NotFoundArtists')
              setPageState('Empty')
            else if (page > 0) showMessage('NotLoadAllArtists')
            else setPageState('Error')
          } else setPageState('Error')
        })
    }
    loadArtists(0)
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
          listOfItems={artists.map(album => {
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
        <title>Music Sync - Todos os Artistas</title>
      </Helmet>
      <Modal />
      <br />
      {Content}
    </div>
  )
}

export default ArtistsScreen
