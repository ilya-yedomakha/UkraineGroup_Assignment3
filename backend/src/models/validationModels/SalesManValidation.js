const Joi = require("joi");

const salesManValidationSchema = Joi.object({
    first_name: Joi.string().trim().required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is a required field"
    }),
    last_name: Joi.string().trim().required().messages({
        "string.empty": "Last name is required",
        "any.required": "Last name is a required field"
    })
});

module.exports = {
    salesManValidationSchema
};