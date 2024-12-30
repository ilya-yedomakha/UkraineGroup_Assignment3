const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const socialPerformanceENUM = require("../models/SocialPerformanceEnUM")

class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class SocialPerformanceRecordService {

static saveSocialPerformanceRecord = async function(salesmanCode, data) {
    try {
        if (!data || !data.goal_description) {
            throw new CustomError("Invalid data: 'goal_description' is required", 400);
        }
        if (!Object.values(socialPerformanceENUM).includes(data.goal_description)) {
            throw new CustomError(
                "Incorrect social performance property (must be " + Object.values(socialPerformanceENUM).join(", ") + ")",
                400
            );
        }
        const socialPerformanceRecordFromDB = await socialPerformanceRecordModel.findOne({
            salesman_code: salesmanCode,
            goal_description: data.goal_description,
        });

        if (socialPerformanceRecordFromDB) {
            throw new CustomError("Social performance record with this property already exists", 400);
        }

        const socialPerformanceRecord = new socialPerformanceRecordModel({
            salesman_code: salesmanCode,
            ...data,
        });

        return await socialPerformanceRecord.save();
    } catch (e) {
        throw e; // Propagate the original error
    }
};

    static updateSocialPerformanceRecord = async function (oldData, newData) {
        try {
            if (newData.hasOwnProperty("target_value"))
                oldData.target_value = newData.target_value;
            if (newData.hasOwnProperty("actual_value"))
                oldData.actual_value = newData.actual_value;
            if (newData.hasOwnProperty("year"))
                oldData.year = newData.year;
            if (newData.hasOwnProperty("salesman_code"))
                oldData.salesman_code = newData.salesman_code;
            if (newData.hasOwnProperty("goal_description"))
                oldData.goal_description = newData.goal_description;
            return await oldData.save()
        } catch (e) {
            throw new Error(e.message)
        }
    }

}

module.exports = SocialPerformanceRecordService;