import Joi from "joi";


export const loginValidator=Joi.object({
  telegramId: Joi.string().required(),
})
