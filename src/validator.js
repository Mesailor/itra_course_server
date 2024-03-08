const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(1).max(64).required(),
  password: Joi.string()
    .pattern(new RegExp(/^[!-z]{8,64}$/))
    .required(),
});

const collectionSchema = Joi.object({
  user_id: Joi.number().required(),
  name: Joi.string()
    .pattern(new RegExp(/[a-zA-Z0-9 ]{1,32}/))
    .min(1)
    .max(32)
    .required(),
  topic: Joi.string().pattern(new RegExp(/^[a-zA-Z]{1,16}$/)),
  description: Joi.string().pattern(new RegExp(/^[!-z ]*$/)),
  imageUrl: Joi.string(),
  itemsSchema: Joi.string().required(),
});

const updateCollectionSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/[a-zA-Z0-9 ]{1,32}/))
    .min(1)
    .max(32)
    .required(),
  topic: Joi.string().pattern(new RegExp(/^[a-zA-Z]{1,16}$/)),
  description: Joi.string().pattern(new RegExp(/^[!-z ]*$/)),
  imageUrl: Joi.string(),
  itemsSchema: Joi.string().required(),
});

function validateUserData(newUser) {
  return userSchema.validate(newUser);
}

function validateCollectionData(collection) {
  return collectionSchema.validate(collection);
}

function validateUpdateCollectionSchema(collection) {
  return updateCollectionSchema.validate(collection);
}

module.exports = {
  validateUserData,
  validateCollectionData,
  validateUpdateCollectionSchema,
};
