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
  description: Joi.string().pattern(new RegExp(/^[!-z \n]*$/)),
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
  description: Joi.string().pattern(new RegExp(/^[!-z \n]*$/)),
  imageUrl: Joi.string(),
  itemsSchema: Joi.string().required(),
});

const itemSchema = Joi.object({
  collection_id: Joi.number().required(),
  name: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]*$/)
    .allow("")
    .required(),
  tags: Joi.string().required(),
  custom_str1_value: Joi.string()
    .pattern(/[!-z ]{0,255}/)
    .allow("")
    .required(),
  custom_str2_value: Joi.string()
    .pattern(/[!-z ]{0,255}/)
    .allow("")
    .required(),
  custom_str3_value: Joi.string()
    .pattern(/[!-z ]{0,255}/)
    .allow("")
    .required(),
  custom_int1_value: Joi.number().required(),
  custom_int2_value: Joi.number().required(),
  custom_int3_value: Joi.number().required(),
  custom_date1_value: Joi.date().required(),
  custom_date2_value: Joi.date().required(),
  custom_date3_value: Joi.date().required(),
  custom_bool1_value: Joi.boolean().required(),
  custom_bool2_value: Joi.boolean().required(),
  custom_bool3_value: Joi.boolean().required(),
  custom_multext1_value: Joi.string()
    .pattern(/[!-z \n]*/)
    .allow("")
    .required(),
  custom_multext2_value: Joi.string()
    .pattern(/[!-z \n]*/)
    .allow("")
    .required(),
  custom_multext3_value: Joi.string()
    .pattern(/[!-z \n]*/)
    .allow("")
    .required(),
});

const updatedItemSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z0-9 ]*$/)
    .allow("")
    .required(),
  tags: Joi.string().required(),
  custom_str1_value: Joi.string()
    .pattern(/[!-z ]{0,255}/)
    .allow("")
    .required(),
  custom_str2_value: Joi.string()
    .pattern(/[!-z ]{0,255}/)
    .allow("")
    .required(),
  custom_str3_value: Joi.string()
    .pattern(/[!-z ]{0,255}/)
    .allow("")
    .required(),
  custom_int1_value: Joi.number().required(),
  custom_int2_value: Joi.number().required(),
  custom_int3_value: Joi.number().required(),
  custom_date1_value: Joi.date().required(),
  custom_date2_value: Joi.date().required(),
  custom_date3_value: Joi.date().required(),
  custom_bool1_value: Joi.boolean().required(),
  custom_bool2_value: Joi.boolean().required(),
  custom_bool3_value: Joi.boolean().required(),
  custom_multext1_value: Joi.string()
    .pattern(/[!-z \n]*/)
    .allow("")
    .required(),
  custom_multext2_value: Joi.string()
    .pattern(/[!-z \n]*/)
    .allow("")
    .required(),
  custom_multext3_value: Joi.string()
    .pattern(/[!-z \n]*/)
    .allow("")
    .required(),
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

function validateNewItem(newItem) {
  return itemSchema.validate(newItem);
}

function validateUpdatedItem(updatedItem) {
  return updatedItemSchema.validate(updatedItem);
}

module.exports = {
  validateUserData,
  validateCollectionData,
  validateUpdateCollectionSchema,
  validateNewItem,
  validateUpdatedItem,
};
