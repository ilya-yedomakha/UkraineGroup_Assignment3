const Joi = require("joi");

const socialPerformanceRecordValidationSchema = Joi.object({
    goal_description: Joi.string().trim().required().messages({
        "string.empty": "Goal description is required",
        "any.required": "Goal description is a required field"
    }),
    target_value: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "Target value must be a number",
        "number.min": "Target value must be at least 1",
        "number.max": "Target value must be at most 5",
        "any.required": "Target value is a required field"
    }),
    actual_value: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "Actual value must be a number",
        "number.min": "Actual value must be at least 1",
        "number.max": "Actual value must be at most 5",
        "any.required": "Actual value is a required field"
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
        "number.base": "Year must be a number",
        "number.min": "Year must be a valid year",
        "number.max": `Year must not be in the future`,
        "any.required": "Year is a required field"
    })
});

module.exports = {
    socialPerformanceRecordValidationSchema
};
