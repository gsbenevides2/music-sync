import React from 'react'
import { Helmet } from 'react-helmet'

import Button from '../../components/Button'
import Input from '../../components/Input'
import { ScreenContainer } from '../../components/ScreenContainer'
import { LoadingScreen } from '../../components/ScreenMessager/LoadingScreen'
import { ServerErrorScreen } from '../../components/ScreenMessager/ServerErrorScreen'
import { SuccessScreen } from '../../components/ScreenMessager/SuccessScreen'
import { useMessage } from '../../contexts/Message/index.'
import api from '../../services/api/api'
import { MusicCreated } from '../../services/api/apiTypes'
import { FetchMusic } from '../../services/api/fetchs/musics'

interface YTMusic {
  youtubeId: string
  title: string
  thumbnailUrl: string
  artist: string
  album: string
  duration: {
    label: string
    totalSeconds: number
  }
}
type PageState = 'SpotifyUrl' | 'Loading' | 'YoutubeUrl' | 'Success'

const AddMusicScreen: React.FC = () => {
  const [spotifyLink, setSpotifyLink] = React.useState('')
  const [requestWait, setRequestWait] = React.useState(false)
  const [youtubeMusics, setYoutubeMusics] = React.useState<YTMusic[]>([])
  const [youtubeLink, setYoutubeLink] = React.useState<string>('')
  const [pageState, setPageState] = React.useState<PageState>('SpotifyUrl')
  const showMessage = useMessage()

  const submit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (navigator.onLine === false) return showMessage('Offline')
      setRequestWait(true)
      const body = youtubeLink.length
        ? { youtubeLink, spotifyLink }
        : { spotifyLink }
      api
        .post<MusicCreated>('/music', body)
        .then(result => {
          const fetcher = new FetchMusic(
            { withAlbum: true, withArtist: true },
            result.data.id
          )

          fetcher.start()

          setPageState('Success')
          setRequestWait(false)
        })
        .catch(error => {
          if (error.response?.data?.code) {
            showMessage(error.response.data.code)
            if (error.response.data.code === 'SelectYoutubeMusic') {
              setPageState('YoutubeUrl')
              setYoutubeMusics(error.response.data.musics)
            }
          }
          setRequestWait(false)
        })
    },
    [spotifyLink, youtubeLink]
  )
  const Header = (
    <Helmet>
      <title>Music Sync - Adicionar Música</title>
    </Helmet>
  )

  if (pageState === 'Loading')
    return (
      <ScreenContainer>
        {Header}
        <LoadingScreen />
      </ScreenContainer>
    )
  else if (pageState === 'SpotifyUrl')
    return (
      <ScreenContainer minimal lowerMargin>
        {Header}
        <form className="w-full px-3" onSubmit={submit} autoComplete="off">
          <Input
            id="spotifyUrl"
            label="Insira a url do Spotify:"
            value={spotifyLink}
            setValue={setSpotifyLink}
            required
            autoComplete="off"
          />
          <Button disabled={requestWait} onClick={() => {}}>
            Proximo
          </Button>
        </form>
      </ScreenContainer>
    )
  else if (pageState === 'YoutubeUrl')
    return (
      <ScreenContainer minimal lowerMargin>
        {Header}
        <form className="w-full px-3" onSubmit={submit} autoComplete="off">
          <Input
            id="youtubeUrl"
            label="Insira a url do Youtube ou escolha uma das sugestões abaixo:"
            value={youtubeLink}
            setValue={setYoutubeLink}
            required
            autoComplete="off"
          />
          <Button disabled={requestWait} onClick={() => {}}>
            Proximo
          </Button>
          <ul className="mt-1">
            {youtubeMusics.map(music => (
              <li
                className="w-full gap-2 flex cursor-pointer duration-300 transform scale-95 hover:scale-100 hover:bg-app-200 hover:text-app-900 p-1 rounded"
                key={music.youtubeId}
                onClick={() =>
                  setYoutubeLink(
                    `https://www.youtube.com/watch?v=${music.youtubeId}`
                  )
                }
              >
                <img className="h-24 w-24" src={music.thumbnailUrl} />
                <div className="w-full grid">
                  <div className="w-full grid">
                    <span
                      className="font-medium w-full inline-block overflow-hidden"
                      style={{ maxHeight: 48 }}
                    >
                      {music.title}
                    </span>
                    <span className="text-sm truncate w-full inline-block">
                      {music.artist}
                    </span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${music.youtubeId}`}
                    target="_blank"
                    className="text-sm truncate text-app-600"
                    rel="noreferrer"
                  >
                    https://www.youtube.com/watch?v={music.youtubeId}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </form>
      </ScreenContainer>
    )
  else if (pageState === 'Success') {
    return (
      <ScreenContainer minimal lowerMargin>
        {Header}
        <SuccessScreen text="Música adicionada com sucesso !" />
      </ScreenContainer>
    )
  } else
    return (
      <ScreenContainer minimal lowerMargin>
        {Header}
        <ServerErrorScreen />
      </ScreenContainer>
    )
}

export default AddMusicScreen
