const mongoose = require("mongoose")

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
        required: false,
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
    }
})

const SalesMan = mongoose.model("SalesMan", salesManSchema)
module.exports = SalesMan