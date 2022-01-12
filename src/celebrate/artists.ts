import { celebrate, Joi } from 'celebrate'

export const artistsValidation = {
  search: celebrate({
    query: {
      name: Joi.string().required(),
      pag: Joi.number().optional()
    }
  }),

  list: celebrate({
    query: {
      pag: Joi.number().optional()
    }
  })
}
