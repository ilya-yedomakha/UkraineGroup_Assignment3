const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const Joi = require("joi");

const reportSchema = new mongoose.Schema({

    salesman_id: {
        type: Schema.Types.ObjectId,
        ref: 'SalesMan',
        required: true
    },
    salesman_code: {
        type: Number,
        required: true
    },
    salesman_firstName: {
        type: String,
        required: true
    },
    salesman_lastName: {
        type: String,
        required: true
    },
    orders_bonuses: [{
        productName: String,
        clientFullName: String,
        clientRating: String,
        items: Number,
        bonus: Number
    }],

    // social_bonuses:[{
    //     name:String,
    //     target_value:Number,
    //     actual_value:Number,
    //     bonus:Number
    // }],

    social_bonuses: [{
        social_performance_id: {
            type: Schema.Types.ObjectId,
            ref: 'social_performance_records',
            required: true
        },
        bonus: Number
    }],

    remarks: {
        type: String
    },

    total_bonus: {
        type: Number
    }
})

const Report = mongoose.model("Report", reportSchema)
module.exports = Report