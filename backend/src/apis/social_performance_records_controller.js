const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salesmanModel = require("../models/SalesMan");

class social_performance_record_controller {

    static getAllSocialPerformanceRecords = async (req, res) => {
        try {
            const data = await socialPerformanceRecordModel.find()
            res.status(200).send({apiStatus: true, message: "all social performance records were found", data})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static getSocialPerformanceRecordById = async (req, res) => {
        try {
            const data = await socialPerformanceRecordModel.findById(req.params.id)
            if (data == null) {
                return res.status(404).send({
                    apiStatus: true,
                    message: "Social performance record by id " + req.params.id + " was not found"
                })
            }
            return res.status(200).send({
                apiStatus: true,
                message: "Social performance record by id " + req.params.id + " was found",
                data
            })
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }


    static deleteSocialPerformanceRecord = async (req, res) => {
        try {
            const socialPerformanceRecord = await socialPerformanceRecordModel.findByIdAndDelete(req.params.id)
            if (!socialPerformanceRecord) {
                return res.status(404).send({apiStatus: false, message: "Social Performance record not found"});
            }

            await salesmanModel.updateOne(
                {_id: socialPerformanceRecord.salesman_id},
                {$pull: {performance_record_ids: socialPerformanceRecord._id}}
            );

            return res.status(200).send({
                apiStatus: true,
                message: "social performance record deleted",
                data: socialPerformanceRecord
            })
        } catch (e) {
            return res.status(500).send({message: e.message, data: e})
        }
    }

    static updateSocialPerformanceRecord = async (req, res) => {

        try {
            if (req.params.id === undefined || req.body === undefined || req.params.id === "" || req.params.body === "" ) {
                return res.status(400).send({message: "Invalid request parameters"});
            }
            let found = await socialPerformanceRecordModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({message: "Social Performance not found"});
            }

            await socialPerformanceRecordModel.findByIdAndUpdate(
                req.params.id,
                req.body
            )
            let recordUpdated = await socialPerformanceRecordModel.findById(req.params.id)
            return res.status(200).send({message: "Social Performance was found", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

}

module.exports = social_performance_record_controller