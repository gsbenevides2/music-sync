import React from 'react'
import { usePalette } from 'react-palette'
import { useSpring, animated as Animated } from 'react-spring'

import { useActualMusicState } from '../../globalStates/states/actualMusic'
import { setAppColor } from '../../utils/colorsTools/setAppColor'
import { ControlsButtons } from './controlsButtons'
import { MusicInfo } from './musicInfo'
import { ReproductionMusicList } from './musicList'
import { DurationBarMemo } from './progress'
import { TooglePlaylistMemoButton } from './tooglePlaylistButton'
import { VolumeBarMemo } from './volume'

const Player: React.FC = () => {
  const actualMusicState = useActualMusicState()
  const actualMusic = actualMusicState.get()
  const vibrantColors = usePalette(`${actualMusic?.album.spotifyCoverUrl}`)

  const [isOpenPlaylist, setIsOpenPlaylist] = React.useState(false)
  const [
    stylesOfAnimationToOpenAndClosePlayer,
    animationApiToOpenAndClosePlayer
  ] = useSpring(() => ({ height: '24px', backgroundColor: 'rgb(79, 70, 229)' }))

  const [playerHeight, setPlayerHeight] = React.useState(0)

  const tooglePlaylist = React.useCallback(() => {
    setIsOpenPlaylist(!isOpenPlaylist)
  }, [isOpenPlaylist])

  React.useEffect(() => {
    let playerHeight = (14 * window.innerHeight) / 100
    if (playerHeight < 73.64) playerHeight = 73.64
    setPlayerHeight(playerHeight)
    window.addEventListener('resize', () => {
      let playerHeight = (14 * window.innerHeight) / 100
      if (playerHeight < 73.64) playerHeight = 73.64
      setPlayerHeight(playerHeight)
    })
  }, [])


  React.useEffect(() => {
    if (isOpenPlaylist) {
      animationApiToOpenAndClosePlayer.start({
        height: `${window.innerHeight}px`
      })
    } else if (actualMusic) {
      const r = document.querySelector(':root') as any
      r.style.setProperty(`--player-height`, `${playerHeight}px`)
      animationApiToOpenAndClosePlayer.start({
        height: `${playerHeight}px`
      })
    }
  }, [isOpenPlaylist, playerHeight, actualMusic])

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
      {actualMusic ? (
        <>
          <div
            className="bottombar px-4 "
            style={{ height: playerHeight, minHeight: '73.64px' }}
          >
            <DurationBarMemo
              playedColor={vibrantColors.data.lightVibrant || 'blue'}
              thumbColor={vibrantColors.data.vibrant || 'darkblue'}
            />
            <div className="flex justify-between items-center gap-1">
              <ControlsButtons />
              <MusicInfo
                playerHeight={playerHeight}
                actualMusic={actualMusic}
              />
              <TooglePlaylistMemoButton
                onClick={tooglePlaylist}
                opened={isOpenPlaylist}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="px-4  max-w-sm w-full items-center">
              <VolumeBarMemo
                playedColor={vibrantColors.data.lightVibrant || 'blue'}
                thumbColor={vibrantColors.data.vibrant || 'darkblue'}
              />
            </div>
          </div>
          <h2 className="p-2">Lista de Reprodução Atual:</h2>
          <ReproductionMusicList playerHeight={playerHeight} />
        </>
      ) : (
        <p className="w-full text-center">Não está tocando nada!</p>
      )}
    </Animated.div>
  )
}

export default Player
/*

 <MediumList
            listOfItems={musicListContext.value.map(music => {
              return {
                id: music.id,
                title: music.name,
                imageSrc: music.album.spotifyCoverUrl,
                subtitle: music.artist.name
              }
            })}
            onDragHandler={handleDragInList}
            ulClassName="overflow-y-scroll hiden-scroll"
            ulStyle={{
              height: `calc(100vh - ${playerHeight + 40 + 24}px)`
            }}
            onClick={musicId => {
              const music = musicListContext.value.find(
                music => music.id === musicId
              )
              if (music) playerContext.playMusic(music)
            }}
          />

  <VolumeBarMemo
                end={1}
                position={playerContext.volume}
                playedColor={vibrantColors.data.lightVibrant || 'blue'}
                thumbColor={vibrantColors.data.vibrant || 'darkblue'}
                setPosition={playerContext.volumeChange}
              />
*/

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
