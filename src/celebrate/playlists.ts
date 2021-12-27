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
    }
  }),
  rearrange: celebrate({
    body: {
      newPosition: Joi.number().required()
    }
  })
}
