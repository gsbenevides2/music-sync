import { celebrate, Joi } from 'celebrate'

export const musicsValidation = {
  create: celebrate({
    body: {
      spotifyLink: Joi.string()
        .required()
        .regex(/https?:\/\/(open.)?spotify.com\/track\/\w{22}/),
      youtubeLink: Joi.string()
        .optional()
        .regex(
          /^https?:\/\/(gaming|m|music|youtu\.be\/|(www\.)?youtube\.com\/(|embed|v|shorts))/
        )
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
      ytId: Joi.string().required().length(11),
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
  }),
  playlist: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional(),
      pag: Joi.number().optional()
    },
    params: {
      id: Joi.string().required()
    }
  }),
  download: celebrate({
    params: {
      id: Joi.string().required()
    }
  })
}
