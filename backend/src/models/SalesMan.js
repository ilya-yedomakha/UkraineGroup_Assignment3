const mongoose = require("mongoose")

const salesManSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
    },

    middleName: {
        type: String,
        trim: true,
        required: false,
    },

    lastName: {
        type: String,
        trim: true,
        required: true,
    },

    fullName: {
        type: String,
        trim: true,
        required: false,
    },

    employeeId: {
        type: Number,
        trim: true,
        required: true,
    },

    code: {
        type: Number,
        trim: true,
        required: true,
    },

    nationality: {
        type: String,
        trim: true,
    },
    dob: {
        type: String,
        trim: true,
    },
    maritalStatus: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    unit: {
        type: String,
        trim: true,
        required: true
    },
    jobTitle: {
        type: String,
        trim: true,
        required: true
    },
    workEmail: {
        type: String,
        trim: true
    },
    workTelephone: {
        type: String,
        trim: true
    }

})

const SalesMan = mongoose.model("SalesMan", salesManSchema)
module.exports = SalesMan