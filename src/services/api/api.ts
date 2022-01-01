import axios from 'axios'

import { getSettingString } from '../../utils/settings'
import { SESSION_ID_KEY, TOKEN_KEY } from '../../utils/settings/keys'

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {}
})

api.interceptors.request.use(
  config => {
    const sessionId = getSettingString(SESSION_ID_KEY)
    const token = getSettingString(TOKEN_KEY)
    if (sessionId && token && config.headers) {
      config.headers.Authorization = token
      config.headers.sessionid = sessionId
    }
    return config
  },
  error => Promise.reject(error)
)

export default api
