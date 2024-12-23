const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salesmanModel = require("../models/SalesMan");

const SocialPerformanceRecordService = require("../services/social-performance-record-service")

class socialPerformanceRecordApi {

    // TODO в нас же всі маніпуляції по code, то це нам може не треба?
    static createSocialPerformanceToSalesman = async (req, res) => {
        try {
            const salesMan = await salesmanModel.findById(req.params.id)

            if (salesMan == null) {
                return res.status(404).send({message: "Salesman with id" + req.params.id + " not found"})
            }

            const socialPerformanceRecordData = SocialPerformanceRecordService.saveSocialPerformanceRecord(salesMan.code, req.body)

            res.status(200).send({
                apiStatus: true,
                message: "Social performance record successfully created",
                data: socialPerformanceRecordData
            });

        } catch (e) {
            if (e.status === 400)
                res.status(400).send({message: e.message, data: e});
            else
                res.status(500).send({message: e.message, data: e});
        }
    }

    static createSocialPerformanceToSalesmanBySalesmanCode = async (req, res) => {
        try {
            const salesMan = await salesmanModel.findOne({code: Number(req.params.code)}).exec()

            if (salesMan == null) {
                return res.status(404).send({message: "Salesman with code" + Number(req.params.code) + " not found"})
            }

            const socialPerformanceRecordData = SocialPerformanceRecordService.saveSocialPerformanceRecord(salesMan.code, req.body)

            res.status(200).send({
                apiStatus: true,
                message: "Social performance record successfully created",
                data: socialPerformanceRecordData
            });

        } catch (e) {
            if (e.status === 400)
                res.status(400).send({message: e.message, data: e});
            else
                res.status(500).send({message: e.message, data: e});
        }
    }


    static getAllSocialPerformanceRecords = async (req, res) => {
        try {
            const data = await socialPerformanceRecordModel.find()
            res.status(200).send({apiStatus: true, message: "all social performance records were found", data})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static getSocialPerformancesRecordBySalesmanCode = async (req, res) => {
        try {
            const socialPerformanceRecords = await socialPerformanceRecordModel.find({salesman_code: req.params.salesmanCode})
            if (socialPerformanceRecords != null)
                res.status(200).send(socialPerformanceRecords)
            else
                res.status(404).send({message: "Social performance record not found"})
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

            return res.status(200).send({
                apiStatus: true,
                message: "social performance record deleted",
            })
        } catch (e) {
            return res.status(500).send({message: e.message, data: e})
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
                message: "social performance record deleted",
            })
        } catch (e) {
            return res.status(500).send({message: e.message, data: e})
        }
    }

    static updateSocialPerformanceRecord = async (req, res) => {
        try {
            if (req.params.id === undefined || req.body === undefined || req.params.id === "" || req.params.body === "") {
                return res.status(400).send({message: "Invalid request parameters"});
            }
            let found = await socialPerformanceRecordModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({message: "Social Performance not found"});
            }
            let recordUpdated = await SocialPerformanceRecordService.updateSocialPerformanceRecord(found, req.body)
            return res.status(200).send({message: "Social Performance was found", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

}

module.exports = socialPerformanceRecordApi