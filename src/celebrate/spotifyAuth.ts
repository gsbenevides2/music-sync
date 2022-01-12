import { celebrate, Joi } from 'celebrate'

export const spotifyAuthValidantions = {
  callback: celebrate({
    query: {
      code: Joi.string().required(),
      state: Joi.string().required()
    }
  })
}
