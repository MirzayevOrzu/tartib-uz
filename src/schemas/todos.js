const Joi = require("joi");

exports.createTodoSchema = Joi.object({
  userId: Joi.number().integer().required(),
  guideId: Joi.number().integer().required(),
});
