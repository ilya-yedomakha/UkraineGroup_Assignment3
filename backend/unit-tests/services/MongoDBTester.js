const mongoose = require("mongoose");
const socialPerformanceRecordModel = require("../../src/models/SocialPerformanceRecord");
const salePerformanceRecordModel = require('../../src/models/SalePerformanceRecord');

const environment = require('../../environments/environment.js').default;
const uri = 'mongodb://' + environment.db.host + ':' + environment.db.port + '/' + environment.db.name;

async function connect() {
    try {
        await mongoose.connect(uri)
            .then(async () => {
                console.log('Connected to MongoDB');
                return true;
            })
            .catch((error) => {
                console.error('Database connection error:', error);
                return false;
            });
    } catch (e) {
        console.error('Failed to connect to MongoDB:', e);
        throw new Error('Connection failed');
    }
}

async function getAllSocialPerformanceRecords() {
    const data = await socialPerformanceRecordModel.find();
    return data;
}

async function getSocialPerformancesRecordBySalesmanCode(code) {
    return await socialPerformanceRecordModel.find({salesman_code: code}, {}, {});
}

async function getSocialPerformanceRecordById(id) {
    try {
        const record = await socialPerformanceRecordModel.findById(id);
        if (!record) {
            throw new Error('Record not found');
        }
        return record;
    } catch (error) {
        console.error('Error fetching record by ID:', error);
        throw error;
    }
}

async function insertSocialPerformanceRecord(record) {
    try {
        const newRecord = new socialPerformanceRecordModel(record);
        const savedRecord = await newRecord.save();
        return savedRecord;
    } catch (error) {
        console.error('Error inserting record:', error);
        throw error;
    }
}

async function updateSocialPerformanceRecord(id, updates) {
    try {
        const updatedRecord = await socialPerformanceRecordModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRecord) {
            throw new Error('Record not found');
        }
        return updatedRecord;
    } catch (error) {
        console.error('Error updating record:', error);
        throw error;
    }
}

async function deleteSocialPerformanceRecord(id) {
    try {
        const socialPerformanceRecord = await socialPerformanceRecordModel.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error updating record:', error);
        throw error;
    }
}

async function getAllSalePerformance() {
    return await salePerformanceRecordModel.find();
}

async function getAllSalePerformanceCountForCurrentYear() {
    const currentYear = new Date().getFullYear();
    return await salePerformanceRecordModel.countDocuments({ activeYear: currentYear });
}

async function getAllSalePerformancesBySalesmanCode(code) {
    return await salePerformanceRecordModel.find({ salesmanGovId: code });
}

module.exports = {
    connect,
    getAllSocialPerformanceRecords,
    getSocialPerformancesRecordBySalesmanCode,
    getSocialPerformanceRecordById,
    insertSocialPerformanceRecord,
    updateSocialPerformanceRecord,
    deleteSocialPerformanceRecord,
    getAllSalePerformance,
    getAllSalePerformanceCountForCurrentYear,
    getAllSalePerformancesBySalesmanCode
};
