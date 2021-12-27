import 'dotenv/config'
import { YoutubeService } from '../services/youtube'

const youtubeService = new YoutubeService()
console.log('OI')
youtubeService.getAndSaveTokenFromCodeAndSecurityID('blablabla', 'blablabla')
