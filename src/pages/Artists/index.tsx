import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { ScreenContainer } from '../../components/ScreenContainer'
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
  const history = useHistory()

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
          const code = e.response?.data?.code || e.code || ''
          if (code === 'Offline') setPageState('Offline')
          else if (code === 'NotMoreError') setPageState('Loaded')
          else if (code === 'SessionNotFound' || code === 'TokenInvalid')
            showMessage(e.response.data.code)
          else if (page === 0 && code === 'NotFoundArtists')
            setPageState('Empty')
          else if (page > 0 && code !== 'NotFoundArtists')
            showMessage('NotLoadAllArtists')
          else if (page > 0 && code === 'NotFoundArtists')
            setPageState('Loaded')
          else setPageState('Error')
        })
    }
    loadArtists(0)
  }, [])

  const artistCallback = React.useCallback((id: string) => {
    history.push(`/dashboard/artist/${id}`)
  }, [])

  let Content
  if (pageState === 'Loading') Content = <LoadingState />
  else if (pageState === 'Offline') Content = <OfflineState />
  else if (pageState === 'Empty') Content = <EmptyState />
  else if (pageState === 'Error') Content = <ErrorState />
  else if (pageState === 'Loaded') {
    Content = (

      <LaggerList
        listOfItems={artists.map(album => {
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
      <Modal />
      <br />
      {Content}
    </ScreenContainer>
  )
}

export default ArtistsScreen
