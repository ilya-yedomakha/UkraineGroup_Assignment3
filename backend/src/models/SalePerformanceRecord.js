const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const salePerformanceSchema = new Schema({
    // CRX href for SalePerformance
    salePerformanceHref: { type: String, required: true },

    // Name of sales order
    salesOrderName: { type: String, required: true },

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
    positionNumber: { type: Number, required: true },

    // Pos-Name for Position
    positionName: { type: String, required: true },

    // Pos-Reference# for Position
    positionReference: { type: String, required: true },

    // Price per unit for Position
    pricePerUnit: { type: Number, required: true },

    // Quantity for Position
    quantity: { type: Number, required: true },

    // Pricing status for Position
    pricingStatus: { type: String, required: true },

    // Pricing rule for Position
    pricingRule: { type: String, required: false },

    // Base amount for Position
    baseAmount: { type: Number, required: true },

    // Discount amount for Position
    discountAmount: { type: Number, required: true },

    // Tax for Position
    taxAmount: { type: Number, required: true },

    // Amount (incl. tax) for Position
    totalAmountInclTax: { type: Number, required: true },

    // CRX href for Product
    productHref: { type: String, required: true },

    // Product number
    productNumber: { type: String, required: true },

    // Product name
    productName: { type: String, required: true },
});

const SalePerformance = model("sale_performance_records", salePerformanceSchema);

module.exports = SalePerformance;
