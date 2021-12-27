import React from 'react'

import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function usePreviousMusic(
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
    const previousMusic = musicList[index - 1]
    if (previousMusic) {
      playMusic(previousMusic)
    }
  }, [actualMusic, musicList, playMusic])
}
