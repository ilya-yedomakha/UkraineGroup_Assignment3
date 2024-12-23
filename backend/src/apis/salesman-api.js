const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const ReportModel = require("../models/Report")

const salesmanService = require("../services/salesman-service")

const FormData = require('form-data');
const axios = require('axios');
const qs = require('qs');

class salesmanApi {

    // Todo воно нам треба?
    static createSalesman = async (req, res) => {
        try {
            const salesman = await salesmanService.saveSalesman(req.body)
            res.status(200).send({apiStatus: true, message: "Salesman created", data: salesman})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    // Todo воно нам треба?
    static getSalesmanById = async (req, res) => {
        try {
            const salesman = await salesmanModel.findById(req.params.id);
            if (salesman != null) {
                res.status(200).send({apiStatus: true, message: "Salesman found", data: salesman})
            } else {
                res.status(404).send({apiStatus: true, message: "Salesman not found"})
            }

        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static getSalesmanByCode = async (req, res) => {
        try {
            const salesman = await salesmanModel.find({code: Number(req.params.code)});
            if (salesman != null) {
                res.status(200).send({apiStatus: true, message: "Salesman found", data: salesman})
            } else {
                res.status(404).send({apiStatus: true, message: "Salesman not found"})
            }

        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static getAllSalesmen = async (req, res) => {
        try {
            const salesman = await salesmanService.getAllSalesman();
            res.status(200).send({apiStatus: true, message: "All salesmen fetched", data: salesman})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    // TODO нам взагалі дозволено видаляти salesman з Orange та чи є сенс робити це по _id?
    static deleteSalesman = async (req, res) => {
        try {
            const salesman = await salesmanModel.findById(req.params.id)

            if (!salesman) {
                return res.status(404).send({apiStatus: false, message: "Salesman not found"});
            }

            await socialPerformanceRecordModel.deleteMany({salesman_code: salesman.code});

            await salesmanModel.deleteOne({_id: req.params.id});

            res.status(200).send({
                apiStatus: true, message: "Salesman successfully deleted", data: salesman
            });
        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }

    // TODO нам взагалі дозволено видаляти salesman з Orange?
    static deleteSalesmanByCode = async (req, res) => {
        try {
            const salesman = await salesmanModel.find({code: Number(req.params.code)})

            if (!salesman) {
                return res.status(404).send({apiStatus: false, message: "Salesman not found"});
            }

            await socialPerformanceRecordModel.deleteMany({salesman_code: salesman.code});

            await salesmanModel.deleteOne({code: Number(req.params.code)});

            res.status(200).send({
                apiStatus: true, message: "Salesman successfully deleted", data: salesman
            });
        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }

    // TODO чи можемо чи оновлювати сейлсмена в оранжі
    static updateSalesman = async (req, res) => {

        if (req.params.id == null || req.body == null) {
            return res.status(400).send({message: "Invalid request parameters"});
        }

        try {
            const salesman = await salesmanModel.findById(req.params.id)
            if (salesman == null) {
                return res.status(404).send({message: "Salesman not found"});
            }
            const newSalesman = await salesmanService.updateSalesman(salesman, req.body)

            res.status(200).send({message: "Salesman updated", data: newSalesman});

        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }

    static updateSalesmanByCode = async (req, res) => {

        if (Number(req.params.code) == null || req.body == null) {
            return res.status(400).send({message: "Invalid request parameters"});
        }

        try {
            const salesman = await salesmanModel.find({code: Number(req.params.code)}).exec()
            if (salesman == null) {
                return res.status(404).send({message: "Salesman not found"});
            }
            const newSalesman = await salesmanService.updateSalesman(salesman, req.body)

            res.status(200).send({message: "Salesman updated", data: newSalesman});

        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }


    static importSeniorSalesmenFromOrangeHRM = async (req, res) => {
        try {
            const tokenBody = {
                client_id: 'api_oauth_id',
                client_secret: 'oauth_secret',
                grant_type: 'password',
                username: 'demouser',
                password: '*Safb02da42Demo$',
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
                return res.status(500).send({message: 'Access token not found in response'});
            }

            const employeeResponse = await axios.get(
                'http://localhost:8888/symfony/web/index.php/api/v1/employee/search',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const employees = employeeResponse.data.data || [];
            const filteredEmployees = employees.filter(
                (employee) => employee.jobTitle === 'Senior Salesman'
            );

            try {
                const savedEmployees = await salesmanService.saveSalesmanFromOrangeHRMToDB(filteredEmployees);
                return res.status(200).send({message: 'Data saved successfully', savedEmployees});
            } catch (e) {
                return res.status(500).send({message: 'Error saving data', error: e.message});
            }

        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }

    static calculateAllBonuses = async (req, res) => {
        try {
            const tokenBody = {
                client_id: 'api_oauth_id',
                client_secret: 'oauth_secret',
                grant_type: 'password',
                username: 'demouser',
                password: '*Safb02da42Demo$',
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
                return res.status(500).send({message: 'Access token not found in response'});
            }

            const salesmen = await salesmanService.getAllSalesman();

            if (!salesmen || salesmen.length === 0) {
                return res.status(404).send({message: 'No salesmen found'});
            }

            const bonuses = [];

            for (const salesman of salesmen) {
                try {
                    const currentYear = new Date().getFullYear();

                    const socialPerformances = await socialPerformanceRecordModel.find({
                        salesman_code: salesman.code,
                        year: currentYear
                    });
                    const salesPerformances = await salePerformanceRecordModel.find({
                        salesmanGovId: salesman.code
                    });

                    const totalBonus = salesmanService.calculateSalesmanBonusForSalesman(salesman, salesPerformances, socialPerformances, new Date().getUTCFullYear());
                    console.log(totalBonus)
                } catch (e) {
                    return res.status(500).send({message: e.message, data: e});
                }
            }


            return res.status(200).send({message: 'Bonuses calculated successfully'});

        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    }

    static sendAllBonusesToHRM = async (req, res) => {
        try {
            const tokenBody = {
                client_id: 'api_oauth_id',
                client_secret: 'oauth_secret',
                grant_type: 'password',
                username: 'demouser',
                password: '*Safb02da42Demo$',
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
                return res.status(500).send({message: 'Access token not found in response'});
            }

            const reports = await ReportModel.find();

            if (reports.length === 0) {
                return res.status(404).send({message: 'No reports found to process'});
            }

            const responses = [];

            for (const report of reports) {
                try {
                    const formData = new FormData();
                    formData.append('year', report.year);
                    formData.append('value', report.total_bonus);

                    const postResponse = await axios.post(
                        `http://localhost:8888/symfony/web/index.php/api/v1/employee/${report.employeeId}/bonussalary`,
                        formData,
                        {
                            headers: {
                                ...formData.getHeaders(),
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    responses.push({
                        employeeId: report.employeeId,
                        status: postResponse.status,
                        data: postResponse.data,
                        year: report.year,
                        value: report.total_bonus

                    });
                } catch (postError) {
                    responses.push({
                        employeeId: report.employeeId,
                        status: postError.response?.status || 500,
                        error: postError.message,
                        year: report.year,
                        value: report.total_bonus
                    });
                }
            }

            return res.status(200).send({
                message: 'Processing completed',
                details: responses,
            });
        } catch (e) {
            return res.status(500).send({message: e.message, data: e});
        }
    };


}

module.exports = salesmanApi