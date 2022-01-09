import { Request, Response } from 'express'
import ytdl from 'ytdl-core'

import { DownloadError } from '../utils/errors/DownloadError'

export function playMiddleware(req: Request, res: Response) {
  const youtubeId = req.query.ytId as string
  console.log(youtubeId)
  const reqY = ytdl(`http://www.youtube.com/watch?v=${youtubeId}`, {
    filter: format => {
      return format.mimeType?.includes('audio/mp4') || false
    }
  })
  reqY.on('info', (e: ytdl.videoInfo) => {
    console.log('play info', e)
    const format = e.formats.find(format =>
      format.mimeType?.includes('audio/mp4')
    )
    if (format) {
      res.set('Content-Type', format.mimeType)
      res.set('Content-Length', format.contentLength)
      res.set('Accept-Ranges', 'bytes')
      reqY.pipe(res)
    }
  })
  reqY.on('end', () => {
    console.log('play end')
    res.end()
  })
  reqY.on('error', e => {
    console.log('play error', e)
    const error = new DownloadError()
    res.send(error.status).json(error.toJson())
  })
  // reqY.pipe(res)
}
