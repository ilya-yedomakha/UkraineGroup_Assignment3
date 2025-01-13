const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const ReportModel = require("../models/Report")

const reportService = require("../services/report-service")

const FormData = require('form-data');
const axios = require('axios');
const qs = require('qs');
const SocialPerformanceRecordService = require("../services/social-performance-record-service");
const salesmanService = require("../services/salesman-service");

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

    static confirmationReverseWithIdsArray = async (req, res) => {
        try {
            const idArray = req.body.ids;

            if (!Array.isArray(idArray) || idArray.length === 0) {
                return res.status(400).json({error: 'Invalid or empty IDs array'});
            }

            const reports = await ReportModel.find({_id: {$in: idArray}});

            if (!reports || reports.length === 0) {
                return res.status(404).json({error: 'No reports found for the provided IDs'});
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
                    return res.status(403).json({error: 'Unauthorized role'});
            }

            res.status(200).json({message: 'Reports processed successfully', result});
        } catch (error) {
            console.error('Error processing reports:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    };

    static confirmationReverseSingleReport = async (req, res) => {
        try {
            const reports = await ReportModel.findOne({_id: req.params.id});

            if (!reports) {
                return res.status(404).json({error: 'No reports found for the provided ID'});
            }

            let result;

            switch (req.session.user.role) {
                case 0:
                    result = await reportService.reverseConfirmSingleReportByCEO(reports);
                    break;
                case 1:
                    result = await reportService.reverseConfirmSingleReportByHR(reports);
                    break;
                default:
                    return res.status(403).json({error: 'Unauthorized role'});
            }

            res.status(200).json({message: 'Report processed successfully', result});
        } catch (error) {
            console.error('Error processing report:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    };


    static deleteAllReports = async (req, res) => {
        try {
            const reports = await ReportModel.deleteMany();
            res.status(200).send({apiStatus: true, message: "All reports deleted", data: reports});
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    };

    static deleteReport = async (req, res) => {
        try {
            const report = await ReportModel.findByIdAndDelete(req.params.id);
            if (!report) {
                return res.status(404).send({apiStatus: false, message: "Report not found"});
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Report deleted",
            });
        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    };

    static recalculateSingleBonusById = async (req, res) => {
        try {
            const report = await ReportModel.findOne({_id: req.params.id});

            const currentYear = new Date().getFullYear();

            if (!report) {
                return res.status(404).send({apiStatus: false, message: 'No report found'});
            } else if (report.year !== currentYear){
                return res.status(404).send({apiStatus: false, message: 'Year must be '+ currentYear});
            }


            const salesman = await salesmanModel.findOne({code: report.salesman_code});

            if (!salesman) {
                return res.status(404).send({apiStatus: false, message: 'No salesaman found'});
            }

            try {
                const socialPerformances = await socialPerformanceRecordModel.find({
                    salesman_code: salesman.code,
                    year: currentYear
                });
                const salesPerformances = await salePerformanceRecordModel.find({
                    salesmanGovId: salesman.code,
                    activeYear: currentYear
                });

                await salesmanService.calculateSalesmanBonusForSalesman(salesman, salesPerformances, socialPerformances, new Date().getUTCFullYear());
            } catch (e) {
                return res.status(500).send({apiStatus: false, message: e.message, data: e});
            }

            return res.status(200).send({apiStatus: true, message: 'Bonus recalculated successfully'});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }


}

module.exports = reportApi