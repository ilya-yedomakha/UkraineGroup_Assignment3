const ReportModel = require('../models/Report');
const RejectionMessageModel = require('../models/RejectionMessage');
const RejectionMessageService = require('../services/rejection-message-service')
require("../models/SocialPerformanceRecord");

class RejectionMessageApi {

    static save = async (req, res) => {
        try {
            const report = await ReportModel.findById(req.params.reportId)
            if (report == null) {
                return res.status(400).send({
                    apiStatus: false,
                    message: "Report by id " + req.params.reportId + " was not found"
                })
            }
            const rejectionMessage = RejectionMessageService.saveRejectionMessage(report, req.body.message)
            res.status(200).send({
                apiStatus: true,
                message: "Rejection feedback created",
                data: rejectionMessage
            });
        } catch (e) {
            const statusCode = e.status || 500;
            res.status(statusCode).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static getById = async (req, res) => {
        try {
            const data = await RejectionMessageModel.findById(req.params.id)
            if (data == null) {
                return res.status(404).send({
                    apiStatus: false,
                    message: "Rejection message by id " + req.params.id + " was not found"
                })
            }
            return res.status(200).send({
                apiStatus: true,
                message: "Rejection message by id " + req.params.id + " was found",
                data: data
            })
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static getForSalesman = async (req, res) => {
        try {
            const data = await RejectionMessageModel.find({salesman_code: req.params.code})
            if (data != null)
                res.status(200).send({
                    apiStatus: true,
                    message: "Rejection message by code " + req.params.code + " was found",
                    data: data
                })
            else
                res.status(404).send({apiStatus: false, message: "Rejection message not found"})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static deleteById = async (req, res) => {
        try {
            const data = await RejectionMessageModel.findByIdAndDelete(req.params.id)
            if (!data) {
                return res.status(404).send({apiStatus: false, message: "Rejection message not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Rejection message was deleted",
            })
        } catch (e) {
            return res.status(500).send({message: e.message, data: e})
        }
    }

    static deleteByReport = async (req, res) => {
        try {
            const data = await RejectionMessageModel.deleteMany({report_id: req.params.reportId})
            if (!data) {
                return res.status(404).send({apiStatus: false, message: "Rejection message not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Rejection message deleted",
            })
        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static deleteBySalesmanCode = async (req, res) => {
        try {
            const data = await RejectionMessageModel.deleteMany({salesman_code: req.params.code})
            if (!data) {
                return res.status(404).send({apiStatus: false, message: "Rejection message not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Rejection message deleted",
            })
        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }
}

module.exports = RejectionMessageApi;