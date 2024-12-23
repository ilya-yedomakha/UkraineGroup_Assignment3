const socialPerformanceENUM = require("./socialPerformanceENUM")
const mongoose = require("mongoose")

const socialPerformanceSchema = new mongoose.Schema({
    goal_description:{
        type: String,
        enum: Object.values(socialPerformanceENUM),
        required: true,
    },
    target_value:{
        type:Number,
        min: 1,
        max: 5,
        required: true
    },
    actual_value:{
        type:Number,
        min: 1,
        max: 5,
        required: false
    },
    year: {
        type:Number,
        min: 0,
        required: true
    },
    salesman_code: {
        type: Number,
        required: true
    }
})
const SocialPerformance = mongoose.model("social_performance_records", socialPerformanceSchema)
module.exports = SocialPerformance