import { celebrate, Joi } from 'celebrate'

export const playlistsValidation = {
  create: celebrate({
    body: {
      name: Joi.string().required()
    }
  }),

  addMusic: celebrate({
    body: {
      musicId: Joi.string().required()
    },
    params: {
      playlistId: Joi.string().required()
    }
  }),
  rearrange: celebrate({
    body: {
      newPosition: Joi.number().required()
    },
    params: {
      playlistId: Joi.string().required(),
      musicId: Joi.string().required()
    }
  }),
  deleteMusic: celebrate({
    params: {
      playlistId: Joi.string().required(),
      musicId: Joi.string().required()
    }
  }),
  listMusics: celebrate({
    query: {
      withAlbum: Joi.boolean().optional(),
      withArtist: Joi.boolean().optional(),
      pag: Joi.number().optional()
    },
    params: {
      playlistId: Joi.string().required()
    }
  })
}
