const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const Joi = require("joi");

const salesManSchema = new mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
        required: true,
    },

    middleName:{
        type: String,
        trim: true,
        required: false,
    },

    lastName:{
        type:String,
        trim: true,
        required: true,
    },

    fullName:{
        type:String,
        trim: true,
        required: true,
    },

    employeeId:{
        type: Number,
        trim: true,
        required: true,
    },

    code:{
        type: Number,
        trim: true,
        required: true,
    },

    performance_record_ids:[{
        type: Schema.Types.ObjectId,
        ref: 'socialPerformanceSchema',
    }],
})

const SalesMan = mongoose.model("SalesMan", salesManSchema)
module.exports = SalesMan