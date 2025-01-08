const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const socialPerformanceENUM = require("../models/SocialPerformanceEnUM")

class ReportService {
    static updateReport = async function (oldData, newData) {
        try {
            if (newData.hasOwnProperty("orders_bonuses"))
                oldData.orders_bonuses = newData.orders_bonuses;
            if (newData.hasOwnProperty("social_bonuses"))
                oldData.social_bonuses = newData.social_bonuses;
            if (newData.hasOwnProperty("remarks"))
                oldData.remarks = newData.remarks;
            if (newData.hasOwnProperty("total_bonus"))
                oldData.total_bonus = newData.total_bonus;
            if (newData.hasOwnProperty("isConfirmed"))
                oldData.isConfirmed = newData.isConfirmed;
            oldData.isSent = false;
            return await oldData.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static submitReport = async function (report) {
        try {
            report.isConfirmed = true;
            return await report.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static unSubmitReport = async function (report) {
        try {
            report.isConfirmed = false;
            return await report.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

module.exports = ReportService;