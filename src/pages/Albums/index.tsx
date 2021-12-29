import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { ScreenContainer } from '../../components/ScreenContainer'
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
  const history = useHistory()
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
          const code = e.response?.data?.code || e.code || ''

          if (code === 'Offline') setPageState('Offline')
          else if (code === 'NotMoreError') setPageState('Loaded')
          else if (code === 'SessionNotFound' || code === 'TokenInvalid')
            showMessage(code)
          else if (page === 0 && code === 'NotFoundAlbums')
            setPageState('Empty')
          else if (page > 0 && code !== 'NotFoundAlbums') showMessage('NotLoadAllAlbums')
          else if (page > 0 && code === 'NotFoundAlbums') setPageState('Loaded')
          else setPageState('Error')
        })
    }
    loadAlbums(0)
  }, [])

  const albumCallback = React.useCallback(
    (id: string) => {
      history.push(`/dashboard/album/${id}`)
    },
    [albums]
  )

  let Content
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'Empty') Content = <EmptyState />
  else if (pageState === 'Error') Content = <ErrorState />
  else if (pageState === 'Loaded') {
    Content = (
      <LaggerList
        listOfItems={albums.map(album => {
          return {
            id: album.id,
            title: album.name,
            imageSrc: album.spotifyCoverUrl
          }
        })}
        onClick={albumCallback}
      />
    )
  }

  return (
    <ScreenContainer>
      <Helmet>
        <title>Music Sync - Todos os Albums</title>
      </Helmet>
      <Modal />
      <br />
      {Content}
    </ScreenContainer>
  )
}

export default AlbumsScreen
