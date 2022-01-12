import { YoutubeService } from '../../services/youtube'

const youtubeService = new YoutubeService()

export class YoutubeAuthModel {
  async getAuthUrl() {
    return await youtubeService.getAuthUrl()
  }

  async callbackToken(code: string, youtubeSecureId: string) {
    return youtubeService.getAndSaveTokenFromCodeAndSecurityID(
      code,
      youtubeSecureId
    )
  }
}
