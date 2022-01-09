import { Request, Response } from 'express'
import path from 'path'

import { playMiddleware } from '../middleware/play'
import { AlbumsModel } from '../models/albums'
import { ArtistsModel } from '../models/artists'
import { MusicsModel } from '../models/musics'
import { PlaylistsModel } from '../models/playlists'
import { AppError } from '../utils/errors/AppError'
import { NotFoundMusic } from '../utils/errors/NotFoundMusic'
import { NotFoundMusics } from '../utils/errors/NotFoundMusics'
import { UnknownError } from '../utils/errors/UnknownError'

export class MusicsController {
  async create(req: Request, res: Response) {
    const spotifylink = req.body.spotifyLink as string
    const useYoutubeId = req.body.useYoutubeId as string | undefined

    const musicsModel = new MusicsModel({
      artistsModel: new ArtistsModel(),
      albumsModel: new AlbumsModel()
    })

    musicsModel
      .create(spotifylink, useYoutubeId)
      .then(id => {
        res.status(201).send({
          code: 'MusicCreated',
          message: 'Music created.',
          id
        })
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async list(req: Request, res: Response) {
    const pag = (req.query.pag as number | undefined) || 0
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false

    const musicsModel = new MusicsModel({})

    musicsModel
      .list(withAlbum, withArtist, pag)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          console.log(error)
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async search(req: Request, res: Response) {
    const pag = (req.query.pag as number | undefined) || 0
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false
    const name = req.query.name as string

    const musicsModel = new MusicsModel({})

    musicsModel
      .search(withAlbum, withArtist, pag, name)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async get(req: Request, res: Response) {
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false

    const id = req.params.id as string

    const musicsModel = new MusicsModel({})

    musicsModel
      .get(withAlbum, withArtist, id)
      .then(music => {
        if (music) res.json(music)
        else {
          const error = new NotFoundMusic()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string

    const musicsModel = new MusicsModel({
      playlistModel: new PlaylistsModel({})
    })

    musicsModel
      .deleteMusic(id)
      .then(() => {
        res.send('OK')
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  download(req: Request, res: Response) {
    const musicId = req.params.id
    res.download(path.resolve(process.cwd(), 'temp', `${musicId}.mp3`))
  }

  play(req: Request, res: Response) {
    playMiddleware(req, res)
  }

  async album(req: Request, res: Response) {
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false
    const pag = Number(req.query.pag as string | undefined) || 0

    const albumId = req.params.id as string
    const musicsModel = new MusicsModel({ albumsModel: new AlbumsModel() })

    musicsModel
      .getByAlbum(albumId, withAlbum, withArtist, pag)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async artist(req: Request, res: Response) {
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false
    const pag = Number(req.query.pag as string | undefined) || 0

    const artistId = req.params.id as string
    const musicsModel = new MusicsModel({ artistsModel: new ArtistsModel() })

    musicsModel
      .getByArtist(artistId, withAlbum, withArtist, pag)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async playlist(req: Request, res: Response) {
    const pag = (req.query.pag as number | undefined) || 0
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false
    const playlistId = req.params.id as string

    const musicsModel = new MusicsModel({
      playlistModel: new PlaylistsModel({})
    })

    musicsModel
      .getByPlaylist(playlistId, withAlbum, withArtist, pag)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          console.log(error)
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }
}
