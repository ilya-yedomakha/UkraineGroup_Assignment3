const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const salePerformanceSchema = new Schema({
    // CRX href for SalePerformance
    salePerformanceHref: { type: String, required: true },

    // Name of sales order
    salesOrderName: { type: String, required: true },

    // Year from when its active
    activeYear: {type: Number, required: true},

    // Priority of sales order
    priority: {type: Number, required: true},

    // CRX href for Salesman
    salesmanHref: { type: String, required: true },

    // Government ID (HRM Code = sid) of Salesman
    salesmanGovId: { type: Number, required: true },

    // CRX href for Client/LegalEntity
    clientHref: { type: String, required: true },

    // Client/LegalEntity Full name
    clientFullName: { type: String, required: true },

    // Client/LegalEntity Rating
    clientRating: { type: Number, required: true },

    // CRX href for Position
    positionHref: { type: String, required: true },

    // Pos-# for Position
    positionLineItemNumber: { type: Number, required: true },

    // Pos-Name for Position
    positionName: { type: String, required: true },

    // Pos-Reference# for Position
    positionNumber: { type: String, required: true },

    // Price per unit for Position
    positionPricePerUnit: { type: Number, required: true },

    // Quantity for Position
    positionQuantity: { type: Number, required: true },

    // Pricing status for Position
    positionPricingStatus: { type: String, required: true },

    // Base amount for Position
    positionBaseAmount: { type: Number, required: true },

    // Discount amount for Position
    positionDiscountAmount: { type: Number, required: true },

    // Tax for Position
    positionTaxAmount: { type: Number, required: true },

    // Amount (incl. tax) for Position
    positionTotalAmountInclTax: { type: Number, required: true },

    // CRX href for Product
    productHref: { type: String, required: true },

    // Product number
    productNumber: { type: String, required: true },

    // Product name
    productName: { type: String, required: true },
});

const SalePerformance = model("sale_performance_records", salePerformanceSchema);

module.exports = SalePerformance;
