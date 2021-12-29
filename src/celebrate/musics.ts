import { celebrate, Joi } from 'celebrate'

export const musicsValidation = {
  create: celebrate({
    body: {
      spotifyLink: Joi.string().required(),
      useYoutubeId: Joi.string().optional()
    }
  }),

  list: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional(),
      pag: Joi.number().optional()
    }
  }),
  search: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional(),
      pag: Joi.number().optional(),
      name: Joi.string().required()
    }
  }),
  play: celebrate({
    query: {
      ytId: Joi.string().required(),
      authorization: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }),
  get: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional()
    }
  }),
  album: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional(),
      pag: Joi.number().optional()
    },
    params: {
      id: Joi.string().required()
    }
  }),
  artist: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional(),
      pag: Joi.number().optional()
    },
    params: {
      id: Joi.string().required()
    }
  })
}
