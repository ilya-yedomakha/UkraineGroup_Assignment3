const mongoose = require("mongoose")
const {Schema} = require("mongoose");

const reportSchema = new mongoose.Schema({

    salesman_code: {
        type: Number,
        required: true
    },
    employeeId: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    ordersBonuses: [{
        productName: String,
        clientFullName: String,
        clientRating: String,
        items: Number,
        initialBonus: Number,
        bonus: Number,
    }],

    socialBonuses: [{
        goal_description:String,
        target_value: Number,
        actual_value:Number,
        initialBonus:Number,
        bonus: Number
    }],

    remarks: {
        type: String
    },

    year: {
        type: Number
    },

    totalBonus: {
        type: Number
    },

    isConfirmedByCEO: {
        type: Boolean,
        required: true,
        default: false
    },
    isConfirmedBySalesman: {
        type: Boolean,
        required: true,
        default: false
    },
    isConfirmedByHR: {
        type: Boolean,
        required: true,
        default: false
    },

    isSent: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Report = mongoose.model("Report", reportSchema)
module.exports = Report