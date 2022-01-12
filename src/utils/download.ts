import axios from 'axios'
import EventEmitter from 'events'
import FFmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import nodeId3 from 'node-id3'
import path from 'path'
import ytdl from 'ytdl-core'

import { MusicsModel } from '../models/musics'
import { AppError } from './errors/AppError'
import { NotFoundMusic } from './errors/NotFoundMusic'

interface MusicData {
  name: string
  youtubeId: string
  number: string
  album: {
    name: string
    year: string
    coverUrl: string
  }
  artist: {
    name: string
  }
}

class DownloadMusicError extends AppError {
  constructor() {
    super('DownloadMusicError', 'Error when downloading music!', 500)
  }
}
class DownloadCoverError extends AppError {
  constructor() {
    super(
      'DownloadCoverError',
      'Error when downloading music album cover!',
      500
    )
  }
}
class ConvertError extends AppError {
  constructor() {
    super('ConvertError', 'Error converting music.', 500)
  }
}
class FileManagerError extends AppError {
  constructor() {
    super('FileManagerError', 'Error managing files.', 500)
  }
}

export class Downloader extends EventEmitter {
  musicId: string
  musicData: MusicData | undefined
  musicPath: string | undefined
  musicPathConverted: string | undefined
  coverPath: string | undefined
  format: ytdl.videoFormat | undefined
  constructor(musicId: string) {
    super()
    this.musicId = musicId
  }

  start() {
    this.getMusicData()
      .then(() => this.downloadMusic())
      .then(() => this.downloadAlbumCover())
      .then(() => this.sanitizeFile())
      .then(() => this.setId3())
      .then(() => this.removeAssentsFiles())
      .then(() => {
        this.emit('success', 'Downloaded')
      })
      .catch(error => {
        this.emit('error', error)
      })
  }

  private getMusicData() {
    this.emit('progress', {
      status: 'GetMusicData'
    })
    return new Promise((resolve, reject) => {
      const musicsModel = new MusicsModel({})
      musicsModel
        .get(true, true, this.musicId)
        .then(data => {
          if (!data || !data.album || !data.artist) reject(new NotFoundMusic())
          else {
            this.musicData = {
              name: data.name,
              youtubeId: data.youtubeId,
              number: data.discNumber,
              album: {
                name: data.album.name,
                year: data.album.spotifyYear,
                coverUrl: data.album.spotifyCoverUrl
              },
              artist: {
                name: data.artist.name
              }
            }
            resolve(null)
          }
        })
        .catch(reject)
    })
  }

  private downloadMusic() {
    this.emit('progress', {
      status: 'DownloadMusic',
      percentage: 0
    })
    return new Promise((resolve, reject) => {
      this.musicPath = path.resolve(
        process.cwd(),
        'temp',
        `${this.musicId}.mp3`
      )
      let length = 0
      let contentLength = 0

      const stream = fs.createWriteStream(this.musicPath)
      const req = ytdl(
        `http://www.youtube.com/watch?v=${this.musicData?.youtubeId}`,
        {
          filter: format => {
            const test = format.mimeType?.includes('audio/mp4') || false
            if (test) this.format = format
            return test
          }
        }
      )
      req.on('response', data => {
        contentLength = Number(data.headers['content-length'])
      })
      req.on('data', (data: Buffer) => {
        length = length + data.length
        const percentage = (100 * length) / contentLength
        this.emit('progress', {
          status: 'DownloadMusic',
          percentage
        })
      })
      req.on('error', error => {
        console.error(error)
        reject(new DownloadMusicError())
      })
      stream.on('finish', () => {
        stream.close()
        resolve(null)
      })
      req.pipe(stream)
    })
  }

  private downloadAlbumCover() {
    this.emit('progress', {
      status: 'DownloadCover',
      percentage: 0
    })
    this.coverPath = path.resolve(process.cwd(), 'temp', `${this.musicId}.jpeg`)
    let length = 0
    let contentLength = 0
    const stream = fs.createWriteStream(this.coverPath)
    const coverUrl = this.musicData?.album.coverUrl as string
    return new Promise((resolve, reject) => {
      const req = axios({
        url: coverUrl,
        method: 'GET',
        responseType: 'stream'
      })
      req.then(response => {
        contentLength = Number(response.headers['content-length'])
        response.data.on('data', (data: Buffer) => {
          length = length + data.length
          const percentage = (100 * length) / contentLength
          this.emit('progress', {
            status: 'DownloadCover',
            percentage
          })
        })
        stream.on('finish', () => {
          stream.close()
          resolve(null)
        })
        response.data.pipe(stream)
      })
      req.catch(error => {
        console.error(error)
        reject(new DownloadCoverError())
      })
    })
  }

  private async sanitizeFile() {
    this.emit('progress', {
      status: 'SanitizeFile',
      percentage: 0
    })
    return new Promise((resolve, reject) => {
      this.musicPathConverted = path.resolve(
        process.cwd(),
        'temp',
        `${this.musicId}_converted.mp3`
      )
      const converted = fs.createWriteStream(this.musicPathConverted)
      FFmpeg()
        .input(this.musicPath as string)
        .audioBitrate(this.format?.audioBitrate as number)
        .withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .outputOption(['-id3v2_version', '4'])
        .on('progress', event => {
          this.emit('progress', {
            status: 'SanitizeFile',
            percentage: event.percent
          })
        })
        .on('error', error => {
          console.error(error)
          reject(new ConvertError())
        })
        .on('end', () => {
          converted.close()
          resolve(null)
        })
        .pipe(converted, { end: true })
    })
  }

  private async setId3() {
    nodeId3.write(
      {
        album: this.musicData?.album.name,
        artist: this.musicData?.artist.name,
        title: this.musicData?.name,
        image: {
          description: 'Cover',
          mime: 'image/jpeg',
          type: {
            id: 3,
            name: 'front cover'
          },
          imageBuffer: fs.readFileSync(this.coverPath as string)
        },
        trackNumber: this.musicData?.number,
        year: this.musicData?.album.year
      },
      this.musicPathConverted as string
    )
  }

  private async removeAssentsFiles() {
    return new Promise((resolve, reject) => {
      fs.unlink(this.musicPath as string, err => {
        if (err) reject(new FileManagerError())
        else {
          fs.unlink(this.coverPath as string, err => {
            if (err) reject(new FileManagerError())
            else {
              fs.rename(
                this.musicPathConverted as string,
                this.musicPath as string,
                err => {
                  if (err) reject(new FileManagerError())
                  else resolve(null)
                }
              )
            }
          })
        }
      })
    })
  }
}
