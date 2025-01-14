const mongoose = require("mongoose")

const RejectionMessageSchema = new mongoose.Schema({

    salesman_code: {
        type: Number,
        required: true
    },

    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reports"
    },

    year: {
        type: Number
    },

    message: {
        type: String,
        required: true
    }
});

const RejectionMessage = mongoose.model("Rejection", RejectionMessageSchema);
module.exports = RejectionMessage;