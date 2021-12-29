import React from 'react'

import Button from '../../components/Button'
import Input from '../../components/Input'
import { useMessage } from '../../components/Message/index.'
import api from '../../services/api/api'
import { MusicCreated } from '../../services/api/apiTypes'
import { getURLVideoID } from '../../utils/youtubeUrl'
import { ErrorState } from '../Dashboard/errorState'
import { LoadingState } from '../Dashboard/loadingState'

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
type PageState = 'SpotifyUrl' | 'Loading' | 'YoutubeUrl'

const AddMusicScreen: React.FC = () => {
  const [spotifyUrl, setSpotifyUrl] = React.useState('')
  const [requestWait, setRequestWait] = React.useState(false)
  const [youtubeMusics, setYoutubeMusics] = React.useState<YTMusic[]>([])
  const [youtubeUrl, setYoutubeUrl] = React.useState<string>('')
  const [pageState, setPageState] = React.useState<PageState>('SpotifyUrl')
  const showMessage = useMessage()

  const submit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      setRequestWait(true)
      const youtubeId = youtubeUrl ? getURLVideoID(youtubeUrl) : null
      api
        .post<MusicCreated>(
          '/music',
          youtubeId
            ? {
                spotifyLink: spotifyUrl,
                useYoutubeId: youtubeId
              }
            : {
                spotifyLink: spotifyUrl
              }
        )
        .then(response => {
          showMessage(response.data.code)
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
      e.preventDefault()
    },
    [spotifyUrl, youtubeUrl]
  )
  if (pageState === 'Loading') return <LoadingState />
  else if (pageState === 'SpotifyUrl')
    return (
      <form onSubmit={submit} autoComplete='off'>
        <Input
          id="spotifyUrl"
          label="Insira a url do Spotify:"
          value={spotifyUrl}
          setValue={setSpotifyUrl}
          required
          autoComplete='off'
        />
        <Button disabled={requestWait} onClick={() => {}}>
          Proximo
        </Button>
      </form>
    )
  else if (pageState === 'YoutubeUrl')
    return (
      <form onSubmit={submit}>
       
        <Input
          id="youtubeUrl"
          label="Insira a url do Youtube ou escolha uma das sugestões abaixo:"
          value={youtubeUrl}
          setValue={setYoutubeUrl}
          required
          autoComplete='off'
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
                setYoutubeUrl(
                  `https://www.youtube.com/watch?v=${music.youtubeId}`
                )
              }
            >
              <img className="h-24 w-24" src={music.thumbnailUrl} />
              <div>
                <span className="bolder">{music.title}</span>
                <br />
                <span className="text-sm truncate">{music.artist}</span>
                <br />
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
        <p style={{ height: '11vh' }} />)
      </form>
    )
  else
    return <ErrorState/>
}

export default AddMusicScreen
