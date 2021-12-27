import React from 'react'

import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function useNextMusic(
  musicList: MusicWithArtistAndAlbum[],
  actualMusic: MusicWithArtistAndAlbum | undefined,
  playMusic: (music: MusicWithArtistAndAlbum) => void
) {
  return React.useCallback(() => {
    let index = -1
    if (actualMusic) {
      const result = musicList.findIndex(music => music.id === actualMusic?.id)
      if(result !== undefined) index = result
    }
    const nextMusic = musicList[index + 1]
    if (nextMusic) {
      playMusic(nextMusic)
    }
  }, [actualMusic, musicList, playMusic])
}
