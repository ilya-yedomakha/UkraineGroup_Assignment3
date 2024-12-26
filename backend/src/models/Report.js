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

    social_bonuses: [{
        goal_description:String,
        target_value: Number,
        actual_value:Number,
        bonus: Number
    }],

    remarks: {
        type: String
    },

    year: {
        type: Number
    },

    total_bonus: {
        type: Number
    },
    isConfirmed: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Report = mongoose.model("Report", reportSchema)
module.exports = Report