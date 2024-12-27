const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const ReportModel = require("../models/Report")

const reportService = require("../services/report-service")

const FormData = require('form-data');
const axios = require('axios');
const qs = require('qs');
const SocialPerformanceRecordService = require("../services/social-performance-record-service");

let environment;
if (process.env.NODE_ENV === 'development') {
    environment = require('../../environments/environment.js').default;
} else {
    environment = require('../../environments/environment.prod.js').default;
}

(async () => {
    const { Client, logger } = await import('camunda-external-task-client-js');

    const config = { baseUrl: 'http://localhost:9090/engine-rest', use: logger, asyncResponseTimeout: 10000 };

    const client = new Client(config);

    client.subscribe('save-confirmed', async function ({ task, taskService }) {
        const _id = task.variables.get('_id');
        // const year = task.variables.get('year');
        const total_bonus = task.variables.get('total_bonus');
        const remarks = task.variables.get('remarks');
        if (!_id) {
            console.log("Empty _id!");
            return;
        }
        const found = await ReportModel.findById(_id);
        if (!found) {
            console.log("Report is not found");
            return;
        }
        var newReport = {
            remarks: remarks,
            total_bonus: total_bonus
        }
        await reportService.updateReport(found, newReport);
        console.log(`Bonus '${_id}': confirmed`);
        console.log("Successfully confirmed!");

        await taskService.complete(task);
    });
})();



class reportApi {

    static getAllReports = async (req, res) => {
        try {
            const reports = await ReportModel.find();
            res.status(200).send({apiStatus: true, message: "All reports fetched", data: reports})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static getAllReportsBySalesmanCode = async (req, res) => {
        try {
            const data = await ReportModel.find({salesman_code: req.params.code})
            if (data != null)
                res.status(200).send({
                    apiStatus: true,
                    message: "Report record by code " + req.params.code + " was found",
                    data
                })
            else
                res.status(404).send({message: "Report record not found"})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static getReportById = async (req, res) => {
        try {
            const data = await ReportModel.findById(req.params.id)
            if (data == null) {
                return res.status(404).send({
                    apiStatus: true,
                    message: "Report record by id " + req.params.id + " was not found"
                })
            }
            return res.status(200).send({
                apiStatus: true,
                message: "Report record by id " + req.params.id + " was found",
                data
            })
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }
    static updateReport = async (req, res) => {
        try {
            if (req.params.id === undefined || req.body === undefined || req.params.id === "" || req.params.body === "") {
                return res.status(400).send({message: "Invalid request parameters"});
            }
            let found = await ReportModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({message: "Report is not found"});
            }
            let recordUpdated = await reportService.updateReport(found, req.body)
            return res.status(200).send({message: "Report was found", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

    static submitReport = async (req, res) => {
        try {
            if (req.params.id === undefined || req.params.id === "") {
                return res.status(400).send({message: "Invalid request parameters"});
            }
            let found = await ReportModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({message: "Report is not found"});
            }
            let recordUpdated = await reportService.submitReport(found)
            return res.status(200).send({message: "Report was submitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

    static submitAllReports = async (req, res) => {
        try {
            let found = await ReportModel.find()
            if (found == null || found.length === 0) {
                return res.status(404).send({message: "There are no Reports"});
            }
            let recordUpdated = [];

            for (let report of found) {
                let updatedRecord = await reportService.submitReport(report);
                recordUpdated.push(updatedRecord);
            }
            return res.status(200).send({message: "Reports were submitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

    static unSubmitReport = async (req, res) => {
        try {
            if (req.params.id === undefined || req.params.id === "") {
                return res.status(400).send({message: "Invalid request parameters"});
            }
            let found = await ReportModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({message: "Report is not found"});
            }
            let recordUpdated = await reportService.unSubmitReport(found)
            return res.status(200).send({message: "Report was unsubmitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

    static unSubmitAllReports = async (req, res) => {
        try {
            let found = await ReportModel.find()
            if (found == null || found.length === 0) {
                return res.status(404).send({message: "There are no Reports"});
            }
            let recordUpdated = [];

            for (let report of found) {
                let updatedRecord = await reportService.unSubmitReport(report);
                recordUpdated.push(updatedRecord);
            }
            return res.status(200).send({message: "Reports were submitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

    static deleteAllReports = async (req, res) => {
        try {
            const reports = await ReportModel.deleteMany();
            res.status(200).send({apiStatus: true, message: "All reports deleted", data: reports})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static deleteReport = async (req, res) => {
        try {
            const report = await ReportModel.findByIdAndDelete(req.params.id)
            if (!report) {
                return res.status(404).send({apiStatus: false, message: "Report not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Report deleted",
            })
        } catch (e) {
            return res.status(500).send({message: e.message, data: e})
        }
    }

}

module.exports = reportApi