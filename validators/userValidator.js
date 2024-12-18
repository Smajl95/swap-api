const Joi = require('joi');

const userSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
});

module.exports = {
    validateUser: (data) => userSchema.validate(data),
};
