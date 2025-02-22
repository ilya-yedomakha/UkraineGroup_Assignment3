const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const SocialPerformanceRecordService = require("../services/social-performance-record-service")

class socialPerformanceRecordApi {

    static getAllSocialPerformanceRecords = async (req, res) => {
        try {
            const data = await socialPerformanceRecordModel.find()
            res.status(200).send({apiStatus: true, message: "all social performance records were found", data: data})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    }

    static getSocialPerformancesRecordBySalesmanCode = async (req, res) => {
        try {
            const data = await socialPerformanceRecordModel.find({salesman_code: req.params.code})
            if (data != null)
                res.status(200).send({
                    apiStatus: true,
                    message: "Social performance record by code " + req.params.code + " was found",
                    data: data
                })
            else
                res.status(404).send({apiStatus: false, message: "Social performance record not found"})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    }

    static getSocialPerformanceRecordById = async (req, res) => {
        try {
            const data = await socialPerformanceRecordModel.findById(req.params.id)
            if (data == null) {
                return res.status(404).send({
                    apiStatus: false,
                    message: "Social performance record by id " + req.params.id + " was not found"
                })
            }
            return res.status(200).send({
                apiStatus: true,
                message: "Social performance record by id " + req.params.id + " was found",
                data: data
            })
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    }

    static deleteSocialPerformanceRecord = async (req, res) => {
        try {
            const socialPerformanceRecord = await socialPerformanceRecordModel.findByIdAndDelete(req.params.id)
            if (!socialPerformanceRecord) {
                return res.status(404).send({apiStatus: false, message: "Social Performance record not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Social performance record deleted",
            })
        } catch (e) {
            return res.status(500).send({message: 'Server error, try again later', data: e})
        }
    }

    static deleteSocialPerformanceRecordBySalesmanCode = async (req, res) => {
        try {
            const socialPerformanceRecord = await socialPerformanceRecordModel.deleteMany({salesman_code: req.params.salesmanCode})
            if (!socialPerformanceRecord) {
                return res.status(404).send({apiStatus: false, message: "Social Performance records not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Social performance record deleted",
            })
        } catch (e) {
            return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    }

    static updateSocialPerformanceRecord = async (req, res) => {
        try {
            if (req.params.id === undefined || req.body === undefined || req.params.id === "" || req.params.body === "") {
                return res.status(400).send({apiStatus: false, message: "Invalid request parameters"});
            }
            let found = await socialPerformanceRecordModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({message: "Social Performance not found"});
            }
            let recordUpdated = await SocialPerformanceRecordService.updateSocialPerformanceRecord(found, req.body)
            return res.status(200).send({apiStatus: true, message: "Social Performance was found", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    }

}

module.exports = socialPerformanceRecordApi