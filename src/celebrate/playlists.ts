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
  get: celebrate({
    query: {
      // playlistId: Joi.string().required()
    }
  }),
  deletePlaylist: celebrate({
    params: {
      playlistId: Joi.string().required()
    }
  })
}
