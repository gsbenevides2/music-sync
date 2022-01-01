import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { ScreenContainer } from '../../components/ScreenContainer'
import { Album } from '../../services/api/apiTypes'
import { FetchAlbums } from '../../services/api/fetchs/albums'
import { useArrayState } from '../../utils/useArrayState'
import { ErrorState } from '../Dashboard/errorState'
import { LoadingState } from '../Dashboard/loadingState'
import { OfflineState } from '../Dashboard/offlineState'
import { EmptyState } from './emptyState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const AlbumsScreen: React.FC = () => {
  const [albums, , appendAlbums] = useArrayState<Album>([])
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const history = useHistory()
  const showMessage = useMessage()

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchAlbums()

    fetcher.addEventListener(
      'data',
      event => {
        const albumsFetched = event.detail
        setPageState('Loaded')
        appendAlbums(albumsFetched, (a, b) => a.id === b.id)
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
        else if (code === 'NotFoundAlbums') setPageState('Empty')
        else if (code === 'NotLoadAllAlbums') setPageState('Loaded')
        else setPageState('Error')
      },
      { signal: abort.signal }
    )

    fetcher.start()
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
