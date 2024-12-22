const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const salePerformanceSchema = new Schema({
    // Name of sales order
    salesOrderName: { type: String, required: true },

    // Year from when its active
    activeYear: {type: Number, required: true},

    // Priority of sales order
    priority: {type: Number, required: true},

    // Client/LegalEntity Full name
    clientFullName: { type: String, required: true },

    // Client/LegalEntity Rating
    clientRating: { type: Number, required: true },

    // Pos-Name for Position
    positionName: { type: String, required: true },

    // Pos-Reference# for Position
    positionNumber: { type: String, required: true },

    // Price per unit for Position
    positionPricePerUnit: { type: Number, required: true },

    // Quantity for Position
    positionQuantity: { type: Number, required: true },

    // Product number
    productNumber: { type: String, required: true },

    // Product name
    productName: { type: String, required: true },
});

const SalePerformance = model("sale_performance_records", salePerformanceSchema);

module.exports = SalePerformance;
