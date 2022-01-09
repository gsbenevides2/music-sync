import { MusicVideo } from 'node-youtube-music/dist/src/models'

import { AppError } from './AppError'

export class SelectYoutubeMusic extends AppError {
  musics: MusicVideo[]
  constructor(musics: MusicVideo[]) {
    super('SelectYoutubeMusic', 'Please select Youtube Music:', 300)
    this.musics = musics
  }

  toJson() {
    const obj = super.toJson()
    return {
      ...obj,
      musics: this.musics
    }
  }
}
