import React from 'react'

import { MusicWithArtistAndAlbum } from '../../../services/api/apiTypes'

export function useMediaSessionMetadata(
  actualMusic: MusicWithArtistAndAlbum | undefined
) {
  React.useEffect(() => {
    if (actualMusic) {
      const mediaMetadata = new window.MediaMetadata({
        title: actualMusic.name,
        artist: actualMusic.artist.name,
        album: actualMusic.album.name,
        artwork: [
          {
            src: actualMusic.album.spotifyCoverUrl
          }
        ]
      })
      navigator.mediaSession.metadata = mediaMetadata
    }
  }, [actualMusic])
}
