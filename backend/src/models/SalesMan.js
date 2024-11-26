const mongoose = require("mongoose")
const {Schema} = require("mongoose");
const Joi = require("joi");

const salesManSchema = new mongoose.Schema({
    first_name:{
        type: String,
        trim: true,
        required: true,
    },

    last_name:{
        type:String,
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