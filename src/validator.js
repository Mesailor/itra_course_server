const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(1).max(64).required(),
  password: Joi.string()
    .pattern(new RegExp(/^[!-z]{8,64}$/))
    .required(),
});

function validateUserData(newUser) {
  return userSchema.validate(newUser);
}

module.exports = { validateUserData };
