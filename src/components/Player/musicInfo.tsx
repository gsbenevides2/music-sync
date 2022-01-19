import React from 'react'

import { MusicWithArtistAndAlbum } from '../../services/api/apiTypes'
import { ImageSpecial } from '../ImageSpecial'

interface Props {
  playerHeight: number
  actualMusic: MusicWithArtistAndAlbum | null
}

export const MusicInfo: React.FC<Props> = ({ playerHeight, actualMusic }) => {
  return (
    <div className="musicInfo flex">
      <ImageSpecial
        src={actualMusic?.album.spotifyCoverUrl}
        style={{ height: playerHeight - 28 }}
      />
      <div
        className="musicData ml-1 grid"
        style={{ height: playerHeight - 28 }}
      >
        <p className="overflow-hidden">
          {actualMusic?.name || 'Não está tocando nada!'}
        </p>
        <p className="text-sm truncate">{actualMusic?.artist.name || ''}</p>
      </div>
    </div>
  )
}
