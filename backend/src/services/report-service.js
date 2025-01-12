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

    static submitReportByCEO = async function (report) {
        try {
            report.isConfirmedByCEO = true;
            return await report.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static unSubmitReportByCEO = async function (report) {
        try {
            report.isConfirmedByCEO = false;
            return await report.save()
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

    // static confirmationPairsArrayByCEO = async function (reports, pairsArray) {
    //     try {
    //         for (const report of reports) {
    //             report.isConfirmedByCEO = pairsArray.find((p) => p._id.toString() === report._id.toString()).confirm;
    //             await report.save()
    //         }
    //     } catch (e) {
    //         throw new Error(e.message)
    //     }
    // }
}

module.exports = ReportService;