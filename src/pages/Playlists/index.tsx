import React from 'react'
import { Helmet } from 'react-helmet'
import { MdPlaylistAddCheck } from 'react-icons/md'
import { useHistory } from 'react-router'

import { OptionsItem, OptionsList } from '../../components/OptionsList'
import { ScreenContainer } from '../../components/ScreenContainer'
import { EmptyScreen } from '../../components/ScreenMessager/EmptyScreen'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { OfflineScreen } from '../../components/ScreenMessager/OfflineScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { useMessage } from '../../contexts/Message/index.'
import { Playlist } from '../../services/api/apiTypes'
import { FetchPlaylists } from '../../services/api/fetchs/playlists'
import { orderByPropety } from '../../utils/orderByProperty'
import { useArrayState } from '../../utils/useArrayState'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

function PlaylistsScreen() {
  const playlistsArray = useArrayState<Playlist>({
    initialState: [],
    orderingFunction: array => orderByPropety(array, 'name'),
    equalsFunction: (a, b) => a.id === b.id
  })
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const showMessage = useMessage()
  const history = useHistory()

  const items: OptionsItem[] = playlistsArray.value.map(playlist => {
    return {
      icon: MdPlaylistAddCheck,
      title: playlist.name,
      onClick: () => history.push(`/dashboard/playlist/${playlist.id}`)
    }
  })
  React.useEffect(() => {
    const abortController = new AbortController()

    const fetcher = new FetchPlaylists()
    fetcher.addEventListener(
      'data',
      event => {
        setPageState('Loaded')
        playlistsArray.append(event.detail)
      },
      { signal: abortController.signal }
    )
    fetcher.addEventListener(
      'error',
      event => {
        const code = event.detail
        if (code === 'Offline') setPageState('Offline')
        else if (code === 'SessionNotFound' || code === 'TokenInvalid')
          showMessage(code)
        else if (code === 'NotFoundPlaylists') setPageState('Empty')
        else setPageState('Error')
      },
      { signal: abortController.signal }
    )
    fetcher.start()
  }, [])

  let Content
  if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'Empty')
    Content = (
      <EmptyScreen text="Você não tem playlists. Tente ir nas configurações." />
    )
  else if (pageState === 'Loaded')
    Content = (
      <OptionsList
        ulClassName="relative transform pt-1.5 w-screen"
        items={items}
      />
    )
  else if (pageState === 'Loading') Content = <LoadingScreen />
  else Content = <ServerErrorScreen />

  return (
    <ScreenContainer lowerMargin>
      <Helmet>
        <title>Music Sync - Todas as Playlists</title>
      </Helmet>

      {Content}
    </ScreenContainer>
  )
}

export default PlaylistsScreen
