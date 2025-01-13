const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const socialPerformanceENUM = require("../models/SocialPerformanceEnUM")

class ReportService {
    static updateReport = async function (oldData, newData) {
        try {
            if (newData.hasOwnProperty("orders_bonuses"))
                oldData.ordersBonuses = newData.ordersBonuses;
            if (newData.hasOwnProperty("social_bonuses"))
                oldData.socialBonuses = newData.socialBonuses;
            if (newData.hasOwnProperty("remarks"))
                oldData.remarks = newData.remarks;
            if (newData.hasOwnProperty("total_bonus"))
                oldData.totalBonus = newData.totalBonus;
            if (newData.hasOwnProperty("isConfirmedByCEO"))
                oldData.isConfirmedByCEO = newData.isConfirmedByCEO
            if (newData.hasOwnProperty("isConfirmedBySalesman"))
                oldData.isConfirmedBySalesman = newData.isConfirmedBySalesman
            if (newData.hasOwnProperty("isConfirmedByHR"))
                oldData.isConfirmedByHR = newData.isConfirmedByHR;
            oldData.isSent = false;
            return await oldData.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static confirmationReverseWithIdsArrayBbyCEO = async function (reports) {
        try {
            for (const report of reports) {
                report.isConfirmedByCEO = !report.isConfirmedByCEO;
                await report.save()
            }
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static confirmationReverseWithIdsArrayBbyHR = async function (reports) {
        try {
            for (const report of reports) {
                report.isConfirmedByHR = !report.isConfirmedByHR;
                await report.save()
            }
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static reverseConfirmSingleReportByHR = async function (report) {
        try {
            report.isConfirmedByHR = !report.isConfirmedByHR;
            await report.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static reverseConfirmSingleReportByCEO = async function (report) {
        try {
            report.isConfirmedByCEO = !report.isConfirmedByCEO;
            await report.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

module.exports = ReportService;