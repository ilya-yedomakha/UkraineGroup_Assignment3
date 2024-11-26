const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const socialPerformanceSchema = new Schema({
    goal_description:{
        type: String,
        trim: true,
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
        required: true
    },
    year : {
        type:Number,
        min: 0,
        required: true
    },
    salesman_id: {
        type: Schema.Types.ObjectId,
        ref: 'SalesMan',
        required: true
    }

})
const SocialPerformance = mongoose.model("social_performance_records", socialPerformanceSchema)
module.exports = SocialPerformance