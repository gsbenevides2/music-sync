import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import LaggerList from '../../components/LaggerList'
import { ScreenContainer } from '../../components/ScreenContainer'
import { EmptyScreen } from '../../components/ScreenMessager/EmptyScreen'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { NotFoundScreen } from '../../components/ScreenMessager/NotFoundScreen'
import { OfflineScreen } from '../../components/ScreenMessager/OfflineScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { useMessage } from '../../contexts/Message/index.'
import { useModal } from '../../contexts/Modal'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import api from '../../services/api/api'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { FetchMusics } from '../../services/api/fetchs/musics'
import { FetchPlaylist } from '../../services/api/fetchs/playlists'
import { getDatabase } from '../../services/database'
import { useArrayState } from '../../utils/useArrayState'

type PageState =
  | 'Loading'
  | 'EmptyPlaylist'
  | 'Error'
  | 'Loaded'
  | 'Offline'
  | 'PlaylistNotFound'

type Params = { id: string }

export const PlaylistScreen: React.FC = () => {
  const musicsArray = useArrayState<MusicWithArtistAndAlbum>({
    initialState: [],
    equalsFunction: (a, b) => a.id === b.id
  })
  const [playlistName, setPlaylistName] = React.useState<string>()
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  const { id } = useParams<Params>()
  const showMessage = useMessage()
  const modal = useModal()

  const handleDragInList = React.useCallback(
    (from: string, to: string) => {
      const fromItemPosition = musicsArray.value.findIndex(
        value => value.id === from
      )
      const toItemPosition = musicsArray.value.findIndex(
        value => value.id === to
      )
      if (fromItemPosition === toItemPosition) return

      if (fromItemPosition !== toItemPosition) {
        const fromItem = musicsArray.value[fromItemPosition]
        let newArray: MusicWithArtistAndAlbum[] = []
        if (fromItemPosition < toItemPosition) {
          const part1 = musicsArray.value.slice(0, fromItemPosition)
          const part2 = musicsArray.value.slice(
            fromItemPosition + 1,
            toItemPosition + 1
          )
          const part3 = musicsArray.value.slice(toItemPosition + 1)
          newArray = [...part1, ...part2, fromItem, ...part3]
          // musicsArray.setValue([...part1, ...part2, fromItem, ...part3])
        } else if (fromItemPosition > toItemPosition) {
          const part1 = musicsArray.value.slice(0, toItemPosition)
          const part2 = musicsArray.value.slice(
            toItemPosition,
            fromItemPosition
          )
          const part3 = musicsArray.value.slice(fromItemPosition + 1)
          newArray = [...part1, fromItem, ...part2, ...part3]
          // musicsArray.setValue()
        }

        if (navigator.onLine) {
          musicsArray.setValue(newArray)
          api
            .post(`/playlist/${id}/${from}/rearrange`, {
              newPosition: toItemPosition
            })
            .then(async () => {
              const database = await getDatabase()

              await database.update({
                in: 'musics_playlists',
                set: { musics: newArray.map(v => v.id) },
                where: { playlistId: id }
              })
            })
        } else {
          showMessage('Offline')
        }
      }
    },
    [musicsArray.value, id]
  )

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchMusics<MusicWithArtistAndAlbum>({
      withAlbum: true,
      withArtist: true,
      findByPlaylistId: id
    })

    fetcher.addEventListener(
      'data',
      event => {
        const musicsFetched = event.detail
        setPageState('Loaded')
        musicsArray.append(musicsFetched)
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
        else if (code === 'NotFoundMusics') setPageState('EmptyPlaylist')
        else if (code === 'NotLoadAllMusics') setPageState('Loaded')
        else if (code === 'PlaylistNotExists') {
          setPlaylistName('Playlist não existe')
          setPageState('PlaylistNotFound')
        } else setPageState('Error')
      },
      { signal: abort.signal }
    )

    fetcher.start()
  }, [id])

  React.useEffect(() => {
    const abort = new AbortController()
    const fetcher = new FetchPlaylist(id)
    fetcher.addEventListener(
      'data',
      event => {
        setPlaylistName(event.detail.name)
      },
      { signal: abort.signal }
    )
    fetcher.start()
    return () => {
      abort.abort()
    }
  }, [id])

  const musicCallback = React.useCallback(
    (id: string) => {
      const music = musicsArray.value.find(music => music.id === id)
      if (!music || !playerContext) return
      playerContext.playMusic(music)
      musicListContext?.setValue(musicsArray.value)
    },
    [musicsArray.value]
  )

  React.useEffect(() => {
    const titlePage = document.getElementById('titlePage')
    if (titlePage) titlePage.innerText = playlistName || 'Carregando Playlist'
  }, [playlistName])

  const onRightClick = React.useCallback(
    (musicId: string) => {
      modal.openModal(
        { musicId, playlistId: id },
        ['AddToPlaylist', 'DeleteMusic', 'RemoveMusicFromPLaylist'],
        () => {
          musicsArray.delete({ id: musicId } as MusicWithArtistAndAlbum)
        }
      )
    },
    [id]
  )

  let Content
  if (pageState === 'Loading') Content = <LoadingScreen />
  else if (pageState === 'Offline') Content = <OfflineScreen />
  else if (pageState === 'EmptyPlaylist')
    Content = <EmptyScreen text="Esta playlist não tem músicas." />
  else if (pageState === 'Error') Content = <ServerErrorScreen />
  else if (pageState === 'PlaylistNotFound')
    Content = <NotFoundScreen text="Essa playlist não existe!" />
  else if (pageState === 'Loaded') {
    Content = (
      <LaggerList
        listOfItems={musicsArray.value.map(music => {
          return {
            id: music.id,
            title: music.name,
            subtitle: music.artist.name,
            imageSrc: music.album.spotifyCoverUrl
          }
        })}
        onClick={musicCallback}
        onRightClick={onRightClick}
        onDragHandler={handleDragInList}
        minimal
        lowerMargin
      />
    )
  }

  return (
    <ScreenContainer minimal>
      <Helmet>
        <title>{playlistName || 'Carregando Playlist'}</title>
      </Helmet>

      <br />
      {Content}
    </ScreenContainer>
  )
}
