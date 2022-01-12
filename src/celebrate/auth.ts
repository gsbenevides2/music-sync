import { celebrate, Joi } from 'celebrate'

export const authValidantion = {
  authCallback: celebrate({
    query: {
      code: Joi.string().required()
    }
  }),
  authenticate: celebrate({
    headers: Joi.object({
      authorization: Joi.string().required(),
      sessionid: Joi.string().required()
    }).unknown()
  }),
  authenticateInQuery: celebrate({
    query: Joi.object({
      authorization: Joi.string().required(),
      sessionid: Joi.string().required()
    }).unknown()
  })
}
