const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const socialPerformanceENUM = require("../models/SocialPerformanceEnUM")

class ReportService {
    static updateReport = async function (oldData, newData) {
        try {
            if (newData.hasOwnProperty("ordersBonuses")) {
                const hasNegativeBonus = newData.ordersBonuses.some(order => order.bonus < 0);
                if (hasNegativeBonus) {
                    const error = new Error("All bonus values in ordersBonuses must be >= 0");
                    error.code = 400;
                    throw error;
                }
                oldData.ordersBonuses = newData.ordersBonuses;
            }

            if (newData.hasOwnProperty("socialBonuses")) {
                const hasNegativeBonus = newData.socialBonuses.some(social => social.bonus < 0);
                if (hasNegativeBonus) {
                    const error = new Error("All bonus values in socialBonuses must be >= 0");
                    error.code = 400;
                    throw error;
                }
                oldData.socialBonuses = newData.socialBonuses;
            }

            if (newData.hasOwnProperty("remarks")) {
                oldData.remarks = newData.remarks;
            }

            if (newData.hasOwnProperty("isConfirmedByHR")) {
                oldData.isConfirmedByHR = newData.isConfirmedByHR;
            }

            oldData.isConfirmedByCEO = false;
            oldData.isConfirmedBySalesman = false;
            oldData.isSent = false;

            const ordersBonusSum = oldData.ordersBonuses?.reduce((sum, order) => sum + (order.bonus || 0), 0) || 0;
            const socialBonusSum = oldData.socialBonuses?.reduce((sum, social) => sum + (social.bonus || 0), 0) || 0;
            oldData.totalBonus = ordersBonusSum + socialBonusSum;

            return await oldData.save();
        } catch (e) {
            throw e;
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

    static recalculateSingleBonus = async function (report){
        try {
            report
            await report.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

module.exports = ReportService;