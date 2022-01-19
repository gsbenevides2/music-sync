import React from 'react'

import { useActualMusicState } from '../../globalStates/states/actualMusic'
import { useMusicListState } from '../../globalStates/states/musicList'
import MediumList from '../MeddiumList'

interface Props {
  playerHeight: number
}

export const ReproductionMusicList: React.FC<Props> = ({ playerHeight }) => {
  const musicListState = useMusicListState()
  const actualMusicState = useActualMusicState()

  const handleDragInList = React.useCallback(
    (from: string, to: string) => {
      const musicList = musicListState.get()
      const fromItemPosition = musicList.findIndex(value => value.id === from)
      const toItemPosition = musicList.findIndex(value => value.id === to)
      if (fromItemPosition === toItemPosition) return
      // const toItem = musicsArray.value[toItemPosition]
      const fromItem = musicList[fromItemPosition]

      if (fromItemPosition !== toItemPosition) {
        if (fromItemPosition < toItemPosition) {
          const part1 = musicList.slice(0, fromItemPosition)
          const part2 = musicList.slice(
            fromItemPosition + 1,
            toItemPosition + 1
          )
          const part3 = musicList.slice(toItemPosition + 1)
          musicListState.set(
            JSON.parse(JSON.stringify([...part1, ...part2, fromItem, ...part3]))
          )
        } else if (fromItemPosition > toItemPosition) {
          const part1 = musicList.slice(0, toItemPosition)
          const part2 = musicList.slice(toItemPosition, fromItemPosition)
          const part3 = musicList.slice(fromItemPosition + 1)
          musicListState.set(
            JSON.parse(JSON.stringify([...part1, fromItem, ...part2, ...part3]))
          )
        }
      }
    },
    [musicListState.value]
  )

  return (
    <MediumList
      listOfItems={musicListState.get().map(music => {
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
        const music = musicListState.get().find(music => music.id === musicId)
        if (music) actualMusicState.set(music)
      }}
    />
  )
}
