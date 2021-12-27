import { SpotifyService } from '../../services/spotify'

const spotifyService = new SpotifyService()

export class SpotifyAuthModel {
  async getAuthUrl() {
    return await spotifyService.getAuthUrl()
  }

  getNewToken(code: string, state: string) {
    return spotifyService.getNewToken(code, state)
  }
}
