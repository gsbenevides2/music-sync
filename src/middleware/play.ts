import { Request, Response } from 'express'
import ytdl from 'ytdl-core'

export function playMiddleware(req: Request, res: Response) {
  const youtubeId = req.query.ytId as string
  const reqY = ytdl(`http://www.youtube.com/watch?v=${youtubeId}`, {
    filter: format => {
      return format.mimeType?.includes('audio/mp4') || false
    }
  })
  reqY.on('info', (e: ytdl.videoInfo) => {
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
  // reqY.pipe(res)
}
