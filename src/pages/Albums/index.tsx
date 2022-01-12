import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { ScreenContainer } from '../../components/ScreenContainer'
import { EmptyScreen } from '../../components/ScreenMessager/EmptyScreen'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { OfflineScreen } from '../../components/ScreenMessager/OfflineScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { useMessage } from '../../contexts/Message/index.'
import { Album } from '../../services/api/apiTypes'
import { FetchAlbums } from '../../services/api/fetchs/albums'
import { orderByPropety } from '../../utils/orderByProperty'
import { useArrayState } from '../../utils/useArrayState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const AlbumsScreen: React.FC = () => {
  const albumsArray = useArrayState<Album>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name'),
    equalsFunction: (a, b) => a.id === b.id
  })
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
        albumsArray.append(albumsFetched)
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

  const albumCallback = React.useCallback((id: string) => {
    history.push(`/dashboard/album/${id}`)
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingScreen />
  else if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'Empty')
    Content = <EmptyScreen text="Você ainda não possui albums." />
  else if (pageState === 'Error') Content = <ServerErrorScreen />
  else if (pageState === 'Loaded') {
    Content = (
      <LaggerList
        listOfItems={albumsArray.value.map(album => {
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

      <br />
      {Content}
    </ScreenContainer>
  )
}

export default AlbumsScreen
