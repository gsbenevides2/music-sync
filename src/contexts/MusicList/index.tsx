import React from 'react'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'

interface Context {
  musicList: MusicWithArtistAndAlbum[]
  setMusicList: React.Dispatch<React.SetStateAction<MusicWithArtistAndAlbum[]>>
}

export const MusicListContext = React.createContext<Context | null>(null)

export const MusicListContextProvider: React.FC = ({ children }) => {
  const [musicList, setMusicList] = React.useState<MusicWithArtistAndAlbum[]>(
    []
  )

  return (
    <MusicListContext.Provider value={{ musicList, setMusicList }}>
      {children}
    </MusicListContext.Provider>
  )
}
