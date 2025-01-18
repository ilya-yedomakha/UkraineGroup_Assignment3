const RejectionMessageModel = require('../models/RejectionMessage');

class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class RejectionMessageService {

    static saveRejectionMessage = async (report, message) => {
        try {
            if (!message) {
                throw new CustomError("Invalid data: 'message' is required", 400);
            }
            const rejectionMessageFromDB = await RejectionMessageModel.findOne({report_id: report._id})
            if (rejectionMessageFromDB) {
                throw new CustomError("Rejection message for this report already exists", 400);
            }
            const rejectionMessageRecord = new RejectionMessageModel({
                salesman_code: report.salesman_code,
                report_id: report._id,
                year: report.year,
                message: message
            });
            return rejectionMessageRecord.save();
        } catch (e) {
            throw e; // Propagate the original error
        }
    }
}

module.exports = RejectionMessageService;