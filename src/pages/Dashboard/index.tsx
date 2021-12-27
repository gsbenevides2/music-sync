import React from 'react'
import { Helmet } from 'react-helmet'

import LaggerList from '../../components/LaggerList'
import { useMessage } from '../../components/Message/index.'
import Modal from '../../components/Modal'
import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { fetchMusicsWithArtistAndAlbum } from '../../services/api/fetchMusicsWithArtistAndAlbum'
import { ReactComponent as HappyMusic } from '../../undraw/happy_music.svg'
import { ReactComponent as ServerDown } from '../../undraw/server_down.svg'
import { ReactComponent as SignalSearching } from '../../undraw/signal_searching.svg'
// import { MusicsResponse } from '../../services/api.types'

type PageState = 'Loading' | 'Empty' | 'Error' | 'Loaded' | 'Offline'

const DashboardScreen: React.FC = () => {
  const [musics, setMusics] = React.useState<MusicWithArtistAndAlbum[]>([])
  const [pageState, setPageState] = React.useState<PageState>('Loading')
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  const showMessage = useMessage()

  React.useEffect(() => {
    function start(page: number) {
      fetchMusicsWithArtistAndAlbum(page)
        .then(musicsFetched => {
          console.log(musicsFetched)
          setPageState('Loaded')
          setMusics(musics => {
            if (musics) return [...musics, ...musicsFetched]
            else return musicsFetched
          })
          if (musicsFetched.length === 10) start(page + 1)
        })
        .catch(e => {
          console.log(e.code || e.response)
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
    start(0)
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
  if (pageState === 'Loading') {
    Content = (
      <div className="flex flex-col items-center mt-3">
        <div className="loader"></div>
        <h1 className="max-w-xl text-center text-2xl">Aguarde</h1>
      </div>
    )
  } else if (pageState === 'Offline') {
    Content = (
      <div className="flex flex-col items-center mt-3">
        <SignalSearching className="w-80 h-80" />
        <h1 className="max-w-xl text-center text-2xl">
          Você está sem internet!
        </h1>
      </div>
    )
  } else if (pageState === 'Empty') {
    Content = (
      <div className="flex flex-col items-center mt-3">
        <HappyMusic className="w-80 h-80" />
        <h1 className="max-w-xl text-center text-2xl">
          Você ainda não adicionou músicas.
          <br />
          Tente ir nas configurações!
        </h1>
      </div>
    )
  } else if (pageState === 'Error') {
    Content = (
      <div className="flex flex-col items-center mt-3">
        <ServerDown className="w-80 h-80" />
        <h1 className="max-w-xl text-center text-2xl">
          Ocorreu um erro inesperado!
          <br />
          Tente novamente mais tarde.
        </h1>
      </div>
    )
  } else if (pageState === 'Loaded') {
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
