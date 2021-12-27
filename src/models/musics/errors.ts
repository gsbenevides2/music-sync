import { MusicVideo } from 'node-youtube-music/dist/src/models'

import { AppError } from '../../utils/error'

export class MusicAlreadyExists extends AppError {
  id: string
  constructor(id: string) {
    super('MusicAlreadyExists', 'Music already exists.', 400)
    this.id = id
  }

  toJson() {
    const obj = super.toJson()
    return {
      ...obj,
      id: this.id
    }
  }
}

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
export class NotFoundMusics extends AppError {
  constructor() {
    super('NotFoundMusics', 'Not Found Musics', 404)
  }
}
export class NotFoundMusic extends AppError {
  constructor() {
    super('NotFoundMusic', 'Not Found Music', 404)
  }
}
