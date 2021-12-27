import { celebrate, Joi } from 'celebrate'

export const youtubeAuthValidantions = {
  callback: celebrate({
    query: {
      code: Joi.string().required(),
      state: Joi.string().required(),
      scope: Joi.any().optional()
    }
  })
}
