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
import { Artist } from '../../services/api/apiTypes'
import { FetchArtists } from '../../services/api/fetchs/artists'
import { orderByPropety } from '../../utils/orderByProperty'
import { useArrayState } from '../../utils/useArrayState'

// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const ArtistsScreen: React.FC = () => {
  const artistsArray = useArrayState<Artist>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name'),
    equalsFunction: (a, b) => a.id === b.id
  })
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const history = useHistory()

  const showMessage = useMessage()

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchArtists()

    fetcher.addEventListener(
      'data',
      event => {
        const artistsFetched = event.detail
        setPageState('Loaded')
        artistsArray.append(artistsFetched)
      },
      { signal: abort.signal }
    )
    fetcher.addEventListener(
      'error',
      event => {
        const code = event.detail
        if (code === 'Offline') setPageState('Offline')
        else if (code === 'NotLoadAllArtists') setPageState('Loaded')
        else if (code === 'SessionNotFound' || code === 'TokenInvalid')
          showMessage(code)
        else if (code === 'NotFoundArtists') setPageState('Empty')
        else setPageState('Error')
      },
      { signal: abort.signal }
    )

    fetcher.start()
  }, [])

  const artistCallback = React.useCallback((id: string) => {
    history.push(`/dashboard/artist/${id}`)
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingScreen />
  else if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'Empty')
    Content = <EmptyScreen text="Você não tem artistas!" />
  else if (pageState === 'Error') Content = <ServerErrorScreen />
  else if (pageState === 'Loaded') {
    Content = (
      <LaggerList
        listOfItems={artistsArray.value.map(album => {
          return {
            id: album.id,
            title: album.name,
            imageSrc: album.spotifyCoverUrl
          }
        })}
        onClick={artistCallback}
      />
    )
  }

  return (
    <ScreenContainer>
      <Helmet>
        <title>Music Sync - Todos os Artistas</title>
      </Helmet>

      <br />
      {Content}
    </ScreenContainer>
  )
}

export default ArtistsScreen
