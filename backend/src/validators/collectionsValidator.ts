import { celebrate, Joi, Segments } from 'celebrate';


export default {
	create: celebrate({
		[Segments.BODY]: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			whatsapp: Joi.string().required(),
			latitude: Joi.number().required(),
			longitude: Joi.number().required(),
			city: Joi.string().required(),
			uf: Joi.string().required().max(2),
			items: Joi.string().regex(/^(\d+,?)+\d$/).required()
		})
	}, {
		abortEarly: false
	})
}
