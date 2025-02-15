const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const ReportModel = require("../models/Report")
const nodemailer = require('nodemailer');

const reportService = require("../services/report-service")

const FormData = require('form-data');
const axios = require('axios');
const qs = require('qs');
const salesmanService = require("../services/salesman-service");

let environment;
if (process.env.NODE_ENV === 'development') {
    environment = require('../../environments/environment.js').default;
} else {
    environment = require('../../environments/environment.prod.js').default;
}

let environment_ilya = require('../../environments/environment_ilya.js').default;

class reportApi {

    static getAllReports = async (req, res) => {
        try {
            const reports = await ReportModel.find();
            res.status(200).send({apiStatus: true, message: "All reports fetched", data: reports})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    }

    static getAllReportsByYear = async (req, res) => {
        try {
            let reports;
            if (req.session.user.role === 0) {
                reports = await ReportModel.find({isConfirmedByHR: true, year: req.params.year});
            } else {
                reports = await ReportModel.find({year: req.params.year});
            }
            res.status(200).send({
                apiStatus: true,
                message: "All reports fetched by year" + req.params.year,
                data: reports
            })
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    }

    static getAllReportsForCurrentYearTop10 = async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();
            const reports = await ReportModel.find({year: currentYear})
                .sort({totalBonus: -1})
                .limit(10);
            res.status(200).send({
                apiStatus: true,
                message: "Top 10 reports fetched by year" + currentYear,
                data: reports
            })
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
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
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
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
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
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
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
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
            if (!found.isConfirmedByHR) {
                return res.status(409).send({apiStatus: false, message: "Cant be edited if not confirmed by HR"});
            }
            if (found.isConfirmedByCEO) {
                return res.status(409).send({apiStatus: false, message: "Cant be edited if confirmed by CEO"});
            }
            let recordUpdated = await reportService.updateReport(found, req.body)
            return res.status(200).send({apiStatus: true, message: "Report was found", data: recordUpdated});

        } catch (e) {
            if (e.code === 400) {
                return res.status(400).send({apiStatus: false, message: 'Not found'});
            }
            return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    }

    static confirmationReverseWithIdsArray = async (req, res) => {
        try {
            const idArray = req.body.ids;

            if (!Array.isArray(idArray) || idArray.length === 0) {
                return res.status(400).json({apiStatus: false, message: 'Invalid or empty IDs array'});
            }

            const reports = await ReportModel.find({_id: {$in: idArray}});

            if (!reports || reports.length === 0) {
                return res.status(404).json({apiStatus: false, message: 'No reports found for the provided IDs'});
            }

            const foundIds = reports.map(report => report._id.toString());

            const missingIds = idArray.filter(id => !foundIds.includes(id));

            if (missingIds.length > 0) {
                return res.status(404).json({
                    apiStatus: false, message: 'Some IDs were not found',
                    missingIds,
                });
            }

            let confirmedByCEOreports = [];
            let notConfirmedByHRreports = [];
            for (const report of reports) {
                if (report.isConfirmedByCEO) {
                    confirmedByCEOreports.push(report)
                }
                if (!report.isConfirmedByHR) {
                    notConfirmedByHRreports.push(report)
                }
            }

            let result;

            switch (req.session.user.role) {
                case 0:
                    if (notConfirmedByHRreports.length > 0) {
                        return res.status(409).send({
                            apiStatus: false,
                            message: 'Can`t change your confirmation if not confirmed by HR',
                            data: notConfirmedByHRreports
                        });
                    }
                    result = await reportService.confirmationReverseWithIdsArrayBbyCEO(reports);
                    break;
                case 1:
                    if (confirmedByCEOreports.length > 0) {
                        return res.status(409).send({
                            apiStatus: false,
                            message: 'Can`t change your confirmation if confirmed by CEO',
                            data: confirmedByCEOreports
                        });
                    }
                    result = await reportService.confirmationReverseWithIdsArrayBbyHR(reports);
                    break;
                default:
                    return res.status(403).json({apiStatus: false, message: 'Unauthorized role'});
            }

            res.status(200).json({message: 'Reports processed successfully', result});
        } catch (error) {
            console.error('Error processing reports:', error);
            res.status(500).json({apiStatus: false, message: 'Internal server error'});
        }
    };

    static confirmBonusForSalesman = async (req, res) => {
        try {
            if (req.params.id === undefined) {
                return res.status(400).send({apiStatus: false, message: "Invalid request parameter"});
            }
            const updatedReport = await ReportModel.findByIdAndUpdate(req.params.id,
                {isConfirmedBySalesman: true},
                {new: true});
            if (updatedReport) {
                res.status(200).send({apiStatus: true, message: "Report was updated", data: updatedReport});
            } else {
                return res.status(404).json({apiStatus: false, message: 'No reports found for the provided IDs'});
            }
        } catch (error) {
            console.error('Error processing report:', error);
            res.status(500).json({apiStatus: false, message: 'Internal server error'});
        }
    }

    static rejectBonusForSalesman = async (req, res) => {
        try {
            if (req.params.id === undefined) {
                return res.status(400).send({apiStatus: false, message: "Invalid request parameter"});
            }
            const updatedReport = await ReportModel.findByIdAndUpdate(req.params.id,
                {isConfirmedBySalesman: false},
                {new: true});
            if (updatedReport) {
                res.status(200).send({apiStatus: true, message: "Report was updated", data: updatedReport});
            } else {
                return res.status(404).json({apiStatus: false, message: 'No reports found for the provided IDs'});
            }
        } catch (error) {
            console.error('Error processing report:', error);
            res.status(500).json({apiStatus: false, message: 'Internal server error'});
        }
    }

    static confirmationReverseSingleReport = async (req, res) => {
        try {
            const reports = await ReportModel.findOne({_id: req.params.id});

            if (!reports) {
                return res.status(404).json({apiStatus: false, message: 'No reports found for the provided ID'});
            }

            let result;

            switch (req.session.user.role) {
                case 0:
                    if (!reports.isConfirmedByHR) {
                        return res.status(409).send({
                            apiStatus: false,
                            message: 'Can`t change your confirmation if not confirmed by HR'
                        });
                    }
                    result = await reportService.reverseConfirmSingleReportByCEO(reports);
                    break;
                case 1:
                    if (reports.isConfirmedByCEO) {
                        return res.status(409).send({
                            apiStatus: false,
                            message: 'Can`t change your confirmation if confirmed by CEO'
                        });
                    }
                    result = await reportService.reverseConfirmSingleReportByHR(reports);
                    break;
                default:
                    return res.status(403).json({apiStatus: false, message: 'Unauthorized role'});
            }

            res.status(200).json({message: 'Report processed successfully', data: result});
        } catch (error) {
            console.error('Error processing report:', error);
            res.status(500).json({apiStatus: false, message: 'Internal server error'});
        }
    };


    static deleteAllReports = async (req, res) => {
        try {
            const existingReports = await ReportModel.findOne({
                $or: [{isConfirmedByHR: true}, {isConfirmedByCEO: true}],
            });

            if (existingReports) {
                return res.status(409).send({
                    apiStatus: false,
                    message: "Operation cannot be performed: Some reports are confirmed by HR or CEO.",
                });
            }

            const reports = await ReportModel.deleteMany();
            res.status(200).send({
                apiStatus: true,
                message: "All reports deleted",
                data: reports,
            });
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    };


    static deleteReport = async (req, res) => {
        try {
            const report = await ReportModel.findByIdAndDelete(req.params.id);
            if (!report) {
                return res.status(404).send({apiStatus: false, message: "Report not found"});
            }

            if (report.isConfirmedByCEO || report.isConfirmedByHR) {
                return res.status(409).send({
                    apiStatus: false,
                    message: "Operation cannot be performed: Bonus is confirmed by HR or CEO."
                });
            }

            return res.status(200).send({
                apiStatus: true,
                message: "Report deleted",
            });
        } catch (e) {
            return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    };

    static recalculateSingleBonusById = async (req, res) => {
        try {
            const report = await ReportModel.findOne({_id: req.params.id});

            if (!report) {
                return res.status(404).send({apiStatus: false, message: 'No report found'});
            } else if (report.isConfirmedByCEO) {
                return res.status(409).send({
                    apiStatus: false,
                    message: 'Can`t recalculate if already confirmed by CEO'
                });
            }


            const salesman = await salesmanModel.findOne({code: report.salesman_code});
            let updReport;
            if (!salesman) {
                return res.status(404).send({apiStatus: false, message: 'No salesman found'});
            }

            try {
                const socialPerformances = await socialPerformanceRecordModel.find({
                    salesman_code: salesman.code,
                    year: report.year
                });
                const salesPerformances = await salePerformanceRecordModel.find({
                    salesmanGovId: salesman.code,
                    activeYear: report.year
                });

                updReport = await salesmanService.calculateSalesmanBonusForSalesman(salesman, salesPerformances, socialPerformances, report.year);
            } catch (e) {
                return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
            }

            return res.status(200).send({apiStatus: true, message: 'Bonus recalculated successfully', data: updReport});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    }

    static patchStoredInHRMSingleBonusById = async (req, res) => {
        try {
            let found = await ReportModel.findById(req.params.id);
            if (!found) {
                return res.status(404).send({apiStatus: false, message: "Report not found"});
            }

            if (found.isSent !== true && found.year !== new Date().getFullYear()) {
                return res.status(400).send({apiStatus: false, message: "Only bonus that is already in OrangeHRM can be patched!"});
            }

            if (!found.isConfirmedByCEO) {
                return res.status(409).send({
                    apiStatus: false,
                    message: 'Can`t recalculate if already confirmed by CEO'
                });
            }

            const tokenBody = {
                client_id: 'api_oauth_id',
                client_secret: 'oauth_secret',
                grant_type: 'password',
                username: environment.orangeHRMUsername,
                password: environment.passwordHRM,
            };

            const tokenResponse = await axios.post(
                'http://localhost:8888/symfony/web/index.php/oauth/issueToken?scope=admin',
                qs.stringify(tokenBody),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const accessToken = tokenResponse.data.access_token;

            if (!accessToken) {
                throw new Error("Access token not found in response");
            }

            const formData = new FormData();
            formData.append('year', found.year);
            formData.append('value', found.totalBonus);

            const postResponse = await axios.post(
                `http://localhost:8888/symfony/web/index.php/api/v1/employee/${found.employeeId}/bonussalary`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            found.isSent = true;
            await found.save();

            return res.status(200).send({
                apiStatus: true,
                message: "Report updated and bonus sent to OrangeHRM",
                data: {found, orangeHRMResponse: postResponse.data},
            });

        } catch (e) {
            if (e.code === 400) {
                return res.status(400).send({apiStatus: false, message: 'Not found'});
            }
            return res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    };


    static
    getSignedByCEOReportsCount = async (req, res) => {
        try {
            const count = await ReportModel.countDocuments({isConfirmedByCEO: true});
            res.status(200).send({
                apiStatus: true,
                message: "Count of reports signed by CEO was calculated",
                data: count
            });
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'Server error, try again later',
                data: e
            });
        }
    }

    static
    getSignedByHRReportsCount = async (req, res) => {
        try {
            const count = await ReportModel.countDocuments({isConfirmedByHR: true});
            res.status(200).send({
                apiStatus: true,
                message: "Count of reports signed by HR was calculated",
                data: count
            });
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'Server error, try again later',
                data: e
            });
        }
    }

    static
    getSignedByHRReportsCountForCurrentYear = async (req, res) => {
        try {
            const count = await ReportModel.countDocuments({isConfirmedByHR: true, year: new Date().getFullYear()});
            res.status(200).send({
                apiStatus: true,
                message: "Count of reports signed by HR for " + new Date().getFullYear() + " was calculated",
                data: count
            });
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'Server error, try again later',
                data: e
            });
        }
    }

    static
    getSignedByCEOReportsCountForCurrentYear = async (req, res) => {
        try {
            const count = await ReportModel.countDocuments({isConfirmedByCEO: true, year: new Date().getFullYear()});
            res.status(200).send({
                apiStatus: true,
                message: "Count of reports signed by HR for " + new Date().getFullYear() + " was calculated",
                data: count
            });
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'Server error, try again later',
                data: e
            });
        }
    }

    static
    getTotalReportsForCurrentYear = async (req, res) => {
        try {
            const count = await ReportModel.countDocuments({year: new Date().getFullYear()});
            res.status(200).send({
                apiStatus: true,
                message: "Total report count for the " + new Date().getFullYear() + " year was calculated",
                data: count
            });
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'Server error, try again later',
                data: e
            });
        }
    }

    static
    getTotalReportsCount = async (req, res) => {
        try {
            const count = await ReportModel.countDocuments();
            res.status(200).send({
                apiStatus: true,
                message: "Total report count was calculated",
                data: count
            });
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'Server error, try again later',
                data: e
            });
        }
    }

    static confirmRemarkSendEmail = async (req, res) => {
        try {
            const {id} = req.params;

            const report = await ReportModel.findById(id);
            if (!report) {
                return res.status(404).json({apiStatus: false, message: "Report not found."});
            }

            if (!report.isConfirmedByCEO || !report.isConfirmedByHR) {
                return res.status(409).send({
                    apiStatus: false,
                    message: 'Bonus isn`t confirmed by CEO or HR'
                });
            }

            if (report.remarks === "" || report.remarks === null) {
                return res.status(409).send({
                    apiStatus: false,
                    message: 'Remark for this bonus is missing!'
                });
            }

            report.isRemarkConfirmedByHR = true;
            await report.save();

            if (environment_ilya) {
                const salesman = await salesmanModel.findOne({code: report.salesman_code});
                if (!salesman) {
                    return res.status(404).send({apiStatus: false, message: 'No salesman found'});
                }

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: environment_ilya.user,
                        pass: environment_ilya.pass,
                    },
                });

                const mailOptions = {
                    from: "CEO@gmail.com",
                    to: salesman.workEmail,
                    subject: "Check your cabinet! Here is your bonus evaluation remark:",
                    text: report.remarks,
                };

                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        return res.status(500).json({apiStatus: false, message: "Failed to send email."});
                    } else {
                        return res.status(200).json({
                            apiStatus: true,
                            message: "Email sent successfully and remark status updated.",
                            data: info.response,
                        });
                    }
                });
            } else {
                return res.status(200).json({
                    apiStatus: true,
                    message: "Email sent virtually & report remark signed.(Must have SMTP to send real email)",
                    data: report
                });
            }
        } catch (err) {
            return res.status(500).json({apiStatus: false, message: "Internal Server Error."});
        }
    };


}

module.exports = reportApi