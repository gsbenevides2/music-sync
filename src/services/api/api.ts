import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {}
})

api.interceptors.request.use(
  config => {
    const sessionId = localStorage.getItem('sessionId')
    const token = localStorage.getItem('token')
    if (sessionId && token && config.headers) {
      config.headers.Authorization = token
      config.headers.sessionid = sessionId
    }
    return config
  },
  error => Promise.reject(error)
)

export default api
