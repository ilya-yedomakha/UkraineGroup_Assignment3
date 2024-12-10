const Joi = require("joi");

const salesManValidationSchema = Joi.object({
    firstName: Joi.string().trim().required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is a required field"
    }),
    lastName: Joi.string().trim().required().messages({
        "string.empty": "Last name is required",
        "any.required": "Last name is a required field"
    }),
    employeeId: Joi.number().required().messages({
        "number.empty": "EmployeeId is required",
        "any.required": "EmployeeId is a required field"
    }),
    code: Joi.number().required().messages({
        "number.empty": "Code is required",
        "any.required": "Code is a required field"
    })
});

module.exports = {
    salesManValidationSchema
};