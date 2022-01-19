import { ActualMusicStateType } from '../states/actualMusic'

export function mediaSessionMetadataHelper(actualMusic: ActualMusicStateType) {
  if ('mediaSession' in navigator && actualMusic) {
    const mediaMetadata = new window.MediaMetadata({
      title: actualMusic.name,
      artist: actualMusic.artist.name,
      album: actualMusic.album.name,
      artwork: [
        {
          src: actualMusic.album.spotifyCoverUrl
        },
        {
          src: `http://localhost:4499/image?imageUrl=${actualMusic.album.spotifyCoverUrl}`
        }
      ]
    })
    navigator.mediaSession.metadata = mediaMetadata
  }
}
