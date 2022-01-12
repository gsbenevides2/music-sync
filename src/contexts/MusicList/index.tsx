import React from 'react'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { Returned as Context, useArrayState } from '../../utils/useArrayState'

export const MusicListContext =
  React.createContext<Context<MusicWithArtistAndAlbum> | null>(null)

export const MusicListContextProvider: React.FC = ({ children }) => {
  const musicList = useArrayState<MusicWithArtistAndAlbum>({
    initialState: [],
    equalsFunction: (a, b) => a.id === b.id
  })

  return (
    <MusicListContext.Provider value={musicList}>
      {children}
    </MusicListContext.Provider>
  )
}
