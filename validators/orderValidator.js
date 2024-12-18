// validators/orderValidator.js
const Joi = require('joi'); // Usando Joi per la validazione

const validateOrder = (orderData) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string()).required(),
    totalAmount: Joi.number().required()
  });

  return schema.validate(orderData);
};

module.exports = { validateOrder };
