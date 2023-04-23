const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
})

validateExistingUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
})

validateNewCard = celebrate({
  user: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageURL: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "image" field must be filled in',
      'string.uri': 'the "image" field must be a valid url',
    })
  })
})

validateDeletedCard = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24),
  })
})

module.exports = {
  validateNewUser,
  validateExistingUser,
  validateNewCard
}