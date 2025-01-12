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

class reportApi {

    static getAllReports = async (req, res) => {
        try {
            const reports = await ReportModel.find();
            res.status(200).send({apiStatus: true, message: "All reports fetched", data: reports})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static getAllReportsByYear = async (req, res) => {
        try {
            const reports = await ReportModel.find({year: req.params.year});
            res.status(200).send({
                apiStatus: true,
                message: "All reports fetched by year" + req.params.year,
                data: reports
            })
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static getAllReportsBySalesmanCode = async (req, res) => {
        try {
            const data = await ReportModel.find({salesman_code: req.params.code})
            if (data != null)
                res.status(200).send({
                    apiStatus: true,
                    message: "Report record by code " + req.params.code + " was found",
                    data: data
                })
            else
                res.status(404).send({apiStatus: false, message: "Report record not found"})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static getReportBySalesmanCodeForCurrentYear = async (req, res) => {
        try {
            const data = await ReportModel.find({salesman_code: req.params.code, year: new Date().getFullYear()})
            if (data != null)
                res.status(200).send({
                    apiStatus: true,
                    message: "Report record by code " + req.params.code + " was found",
                    data: data
                })
            else
                res.status(404).send({apiStatus: false, message: "Report record not found"})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
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
                data: data
            })
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }
    static updateReport = async (req, res) => {
        try {
            if (req.params.id === undefined || req.body === undefined || req.params.id === "" || req.params.body === "") {
                return res.status(400).send({apiStatus: false, message: "Invalid request parameters"});
            }
            let found = await ReportModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({apiStatus: false, message: "Report is not found"});
            }
            let recordUpdated = await reportService.updateReport(found, req.body)
            return res.status(200).send({apiStatus: true, message: "Report was found", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static submitReportByCEO = async (req, res) => {
        try {
            if (req.params.id === undefined || req.params.id === "") {
                return res.status(400).send({apiStatus: false, message: "Invalid request parameters"});
            }
            let found = await ReportModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({apiStatus: false, message: "Report is not found"});
            }
            let recordUpdated = await reportService.submitReportByCEO(found)
            return res.status(200).send({apiStatus: true, message: "Report was submitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static submitAllReportsByCEO = async (req, res) => {
        try {
            let found = await ReportModel.find()
            if (found == null || found.length === 0) {
                return res.status(404).send({message: "There are no Reports"});
            }
            let recordUpdated = [];

            for (let report of found) {
                let updatedRecord = await reportService.submitReportByCEO(report);
                recordUpdated.push(updatedRecord);
            }
            return res.status(200).send({apiStatus: true, message: "Reports were submitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static unSubmitReportByCEO = async (req, res) => {
        try {
            if (req.params.id === undefined || req.params.id === "") {
                return res.status(400).send({apiStatus: false, message: "Invalid request parameters"});
            }
            let found = await ReportModel.findById(req.params.id)
            if (found == null) {
                return res.status(404).send({apiStatus: false, message: "Report is not found"});
            }
            let recordUpdated = await reportService.unSubmitReportByCEO(found)
            return res.status(200).send({apiStatus: true, message: "Report was unsubmitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static unSubmitAllReportsByCEO = async (req, res) => {
        try {
            let found = await ReportModel.find()
            if (found == null || found.length === 0) {
                return res.status(404).send({apiStatus: false, message: "There are no Reports"});
            }
            let recordUpdated = [];

            for (let report of found) {
                let updatedRecord = await reportService.unSubmitReportByCEO(report);
                recordUpdated.push(updatedRecord);
            }
            return res.status(200).send({apiStatus: true, message: "Reports were submitted", data: recordUpdated});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static confirmationReverseWithIdsArray = async (req, res) => {
        try {
            const idArray = req.body.ids;

            if (!Array.isArray(idArray) || idArray.length === 0) {
                return res.status(400).json({ error: 'Invalid or empty IDs array' });
            }

            const reports = await ReportModel.find({ _id: { $in: idArray } });

            if (!reports || reports.length === 0) {
                return res.status(404).json({ error: 'No reports found for the provided IDs' });
            }

            let result;

            switch (req.session.user.role) {
                case 0:
                    result = await reportService.confirmationReverseWithIdsArrayBbyCEO(reports);
                    break;
                case 1:
                    result = await reportService.confirmationReverseWithIdsArrayBbyHR(reports);
                    break;
                default:
                    return res.status(403).json({ error: 'Unauthorized role' });
            }

            res.status(200).json({ message: 'Reports processed successfully', result });
        } catch (error) {
            console.error('Error processing reports:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    // static confirmationPairsArrayByCEO = async (req, res) => {
    //     try {
    //         const pairsArray = req.body.pairs;
    //
    //         if (!Array.isArray(pairsArray) || pairsArray.length === 0) {
    //             return res.status(400).json({ error: 'Invalid or empty pairs array' });
    //         }
    //
    //         const ids = pairsArray.map((entry) => entry._id);
    //         const reports = await ReportModel.find({ _id: { $in: ids } });
    //
    //         if (!reports || reports.length === 0) {
    //             return res.status(404).json({ error: 'No reports found for the provided IDs' });
    //         }
    //
    //         const result = await reportService.confirmationPairsArrayByCEO(reports, pairsArray);
    //
    //         res.status(200).json({ message: 'Reports processed successfully', result });
    //     } catch (error) {
    //         console.error('Error processing reports:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // };


    static deleteAllReports = async (req, res) => {
        try {
            const reports = await ReportModel.deleteMany();
            res.status(200).send({ apiStatus: true, message: "All reports deleted", data: reports });
        } catch (e) {
            res.status(500).send({ apiStatus: false, message: e.message, data: e });
        }
    };

    static deleteReport = async (req, res) => {
        try {
            const report = await ReportModel.findByIdAndDelete(req.params.id);
            if (!report) {
                return res.status(404).send({ apiStatus: false, message: "Report not found" });
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Report deleted",
            });
        } catch (e) {
            return res.status(500).send({ apiStatus: false, message: e.message, data: e });
        }
    };


}

module.exports = reportApi