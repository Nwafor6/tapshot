import Joi from "joi";


export const loginValidator=Joi.object({
  userId: Joi.string().required(),
})
