import React from 'react'
import {
  // MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious // MdArrowDropDown,
} from 'react-icons/md'
import { usePalette } from 'react-palette'
import { useSpring, animated as Animated } from 'react-spring'

import { MusicListContext } from '../../contexts/MusicList'
import { PlayerContext } from '../../contexts/Player'
import { setAppColor } from '../../utils/colorsTools/setAppColor'
import CircleButton from '../CircleButton'
import { ImageSpecial } from '../ImageSpecial'
import MediumList from '../MeddiumList'
import { PlayAndPauseMemoButton } from './playAndPauseButton'
import { DurationBarMemo } from './progress'
import { TooglePlaylistMemoButton } from './tooglePlaylistButton'
import { VolumeBarMemo } from './volume'

const Player: React.FC = () => {
  const playerContext = React.useContext(PlayerContext)
  const musicListContext = React.useContext(MusicListContext)
  if (playerContext === null || musicListContext === null) return <></>
  const vibrantColors = usePalette(
    `${playerContext.actualMusic?.album.spotifyCoverUrl}`
  )

  const [isOpenPlaylist, setIsOpenPlaylist] = React.useState(false)
  const [
    stylesOfAnimationToOpenAndClosePlayer,
    animationApiToOpenAndClosePlayer
  ] = useSpring(() => ({ height: '24px', backgroundColor: 'rgb(79, 70, 229)' }))
  const [, setPercentage] = React.useState('0px')

  const [playerHeight, setPlayerHeight] = React.useState(0)

  const tooglePlaylist = React.useCallback(() => {
    setIsOpenPlaylist(!isOpenPlaylist)
  }, [isOpenPlaylist])

  React.useEffect(() => {
    setPlayerHeight((14 * window.innerHeight) / 100)
    window.addEventListener('resize', () => {
      setPlayerHeight((14 * window.innerHeight) / 100)
    })
  }, [])

  React.useEffect(() => {
    const percentage =
      (window.innerWidth * playerContext.currentTime) / playerContext.duration
    setPercentage(`${percentage}px`)
  }, [playerContext.currentTime, playerContext.duration])

  React.useEffect(() => {
    if (isOpenPlaylist) {
      animationApiToOpenAndClosePlayer.start({
        height: `${window.innerHeight}px`
      })
    } else if (playerContext.actualMusic) {
      const r = document.querySelector(':root') as any
      r.style.setProperty(`--player-height`, `${playerHeight}px`)
      animationApiToOpenAndClosePlayer.start({
        height: `${playerHeight}px`
      })
    }
  }, [isOpenPlaylist, playerHeight, playerContext.actualMusic])

  React.useEffect(() => {
    if (
      !vibrantColors.error &&
      vibrantColors.data.darkVibrant &&
      vibrantColors.data.vibrant
    ) {
      animationApiToOpenAndClosePlayer.start({
        backgroundColor: vibrantColors.data.darkVibrant
      })
      setAppColor(vibrantColors.data.vibrant)
    }
  }, [vibrantColors])

  return (
    <Animated.div
      style={stylesOfAnimationToOpenAndClosePlayer}
      className="text-white fixed w-screen -bottom-0 left-0 z-30"
    >
      {playerContext.actualMusic ? (
        <>
          <div className="bottombar  px-4 " style={{ height: playerHeight }}>
            <DurationBarMemo
              playedColor={vibrantColors.data.lightVibrant || 'blue'}
              thumbColor={vibrantColors.data.vibrant || 'darkblue'}
              disabled={playerContext.waiting}
              setPosition={playerContext.setPosition}
              position={playerContext.currentTime}
              end={playerContext.duration}
            />
            <div className="flex justify-between items-center gap-1">
              <div className="playerButtons flex">
                <CircleButton onClick={playerContext.previousMusic}>
                  <MdSkipPrevious />
                </CircleButton>
                <PlayAndPauseMemoButton
                  onClick={playerContext.playOrPause}
                  playing={playerContext.playing}
                  disabled={playerContext.waiting}
                />
                <CircleButton>
                  <MdSkipNext onClick={playerContext.nextMusic} />
                </CircleButton>
              </div>
              <div className="musicInfo flex">
                <ImageSpecial
                  src={playerContext.actualMusic?.album.spotifyCoverUrl}
                  style={{ height: playerHeight - 28 }}
                />
                <div
                  className="musicData ml-1 grid"
                  style={{ height: playerHeight - 28 }}
                >
                  <p className="overflow-hidden">
                    {playerContext.actualMusic?.name ||
                      'Não está tocando nada!'}
                  </p>
                  <p className="text-sm truncate">
                    {playerContext.actualMusic?.artist.name || ''}
                  </p>
                </div>
              </div>
              <div className="musicList flex">
                <TooglePlaylistMemoButton
                  onClick={tooglePlaylist}
                  opened={isOpenPlaylist}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className=" px-4  max-w-sm w-full items-center">
              <VolumeBarMemo
                end={1}
                position={playerContext.volume}
                playedColor={vibrantColors.data.lightVibrant || 'blue'}
                thumbColor={vibrantColors.data.vibrant || 'darkblue'}
                setPosition={playerContext.volumeChange}
              />
            </div>
          </div>
          <h2 className="p-2">Lista de Reprodução Atual:</h2>
          <MediumList
            listOfItems={musicListContext.musicList.map(music => {
              return {
                id: music.id,
                title: music.name,
                imageSrc: music.album.spotifyCoverUrl,
                subtitle: music.artist.name
              }
            })}
            ulClassName="overflow-y-scroll hiden-scroll"
            ulStyle={{
              height: `calc(100vh - ${playerHeight + 40 + 24}px)`
            }}
            onClick={musicId => {
              const music = musicListContext.musicList.find(
                music => music.id === musicId
              )
              if (music) playerContext.playMusic(music)
            }}
          />
        </>
      ) : (
        <p className="w-full text-center">Não está tocando nada!</p>
      )}
    </Animated.div>
  )
}

export default Player

/*
    <div className="grid px-4 grid-cols-7 max-w-sm items-center">
              <VolumeBarMemo
                end={1}
                position={playerContext.volume}
                playedColor={vibrantColors.data.lightVibrant || 'blue'}
                thumbColor={vibrantColors.data.vibrant || 'darkblue'}
                setPosition={playerContext.volumeChange}
              />
            </div>
              <div className="flex items-center col-span-2 justify-around">
                <MdShuffle className="cursor-pointer" size="1.5em" />
                <MdStop className="cursor-pointer" size="1.5em" />
                <MdShortText className="cursor-pointer" size="1.5em" />
              </div>
*/
