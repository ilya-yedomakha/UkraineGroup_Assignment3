const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const ReportModel = require("../models/Report")

const salesmanService = require("../services/salesman-service")
const userService = require("../services/user-service")

const FormData = require('form-data');
const axios = require('axios');
const qs = require('qs');
const SocialPerformanceRecordService = require("../services/social-performance-record-service");
const mongoose = require("mongoose");

let environment;
if (process.env.NODE_ENV === 'development') {
    environment = require('../../environments/environment.js').default;
} else {
    environment = require('../../environments/environment.prod.js').default;
}

class salesmanApi {

    static getSalesmanByCode = async (req, res) => {
        try {
            const salesman = await salesmanModel.findOne({code: Number(req.params.code)});
            if (salesman != null) {
                res.status(200).send({apiStatus: true, message: "Salesman found", data: salesman})
            } else {
                res.status(404).send({apiStatus: true, message: "Salesman not found"})
            }

        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static getAllSalesmen = async (req, res) => {
        try {
            const salesman = await salesmanService.getAllSalesman();
            res.status(200).send({apiStatus: true, message: "All salesmen fetched", data: salesman})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e})
        }
    }

    static importSeniorSalesmenFromOrangeHRM = async (req, res) => {
        try {
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
                return res.status(500).send({apiStatus: false, message: 'Access token not found in response'});
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
            const filteredEmployees = employees.filter((employee) => employee.jobTitle === 'Senior Salesman');

            const enrichedEmployees = await Promise.all(
                filteredEmployees.map(async (employee) => {
                    try {
                        const contactDetailResponse = await axios.get(
                            `http://localhost:8888/symfony/web/index.php/api/v1/employee/${employee.employeeId}/contact-detail`,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );

                        const contactDetails = contactDetailResponse.data.data;
                        return {
                            ...employee,
                            workTelephone: contactDetails.workTelephone || null,
                            workEmail: contactDetails.workEmail || null,
                        };
                    } catch (error) {
                        console.error(`Error fetching contact details for employee ${employee.employeeId}:`, error.message);
                        return employee;
                    }
                })
            );

            try {
                const savedEmployees = await salesmanService.saveSalesmanFromOrangeHRMToDB(enrichedEmployees);

                await this.createUsersForEmployees(savedEmployees);

                return res.status(200).send({
                    apiStatus: true,
                    message: 'Data saved successfully',
                    data: savedEmployees
                });
            } catch (e) {
                return res.status(500).send({apiStatus: false, message: 'Error saving data', error: e.message});
            }
        } catch (e) {
            res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    };

    static createUsersForEmployees = async (employees) => {
        try {
            const users = employees.map((employee) => ({
                username: employee.workEmail,
                code: employee.code,
                password: '1234',
                //todo ROLE_SALESMAN,
                firstname: employee.firstName,
                lastname: employee.lastName,
                email:employee.workEmail,
                isAdmin: false
            }));
            for (const user of users) {
                let foundUser = await userService.getByCode(mongoose.connection, user.code);
                if (!foundUser) {
                    await userService.add(mongoose.connection, user);
                }
            }

        } catch (error) {
            console.error('Error creating users:', error.message);
            throw new Error('Failed to create users from employees.');
        }
    };


    static calculateAllBonuses = async (req, res) => {
        try {
            const salesmen = await salesmanService.getAllSalesman();

            if (!salesmen || salesmen.length === 0) {
                return res.status(404).send({apiStatus: false, message: 'No salesmen found'});
            }

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

                    await salesmanService.calculateSalesmanBonusForSalesman(salesman, salesPerformances, socialPerformances, new Date().getUTCFullYear());
                } catch (e) {
                    return res.status(500).send({apiStatus: false, message: e.message, data: e});
                }
            }

            return res.status(200).send({apiStatus: true, message: 'Bonuses calculated successfully'});

        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    }

    static sendAllBonusesToHRM = async (req, res) => {
        try {
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
                return res.status(500).send({apiStatus: true, message: 'Access token not found in response'});
            }

            const reports = await ReportModel.find({isConfirmed: true});

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
                        `http://localhost:8888/symfony/web/index.php/api/v1/employee/${(await report).employeeId}/bonussalary`,
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
                        year: report.year,
                        value: report.total_bonus
                    });
                    (await report).isSent = true
                    await report.save()
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
                apiStatus: true,
                message: 'All confirmed bonuses were sent to OrangeHRM!',
                data: responses,
            });
        } catch (e) {
            return res.status(500).send({apiStatus: false, message: e.message, data: e});
        }
    };

    static createSocialPerformanceToSalesmanBySalesmanCode = async (req, res) => {
        try {
            const salesMan = await salesmanModel.findOne({code: Number(req.params.code)}).exec()

            if (salesMan == null) {
                return res.status(404).send({
                    apiStatus: false,
                    message: "Salesman with code" + Number(req.params.code) + " not found"
                })
            }

            const socialPerformanceRecordData = await SocialPerformanceRecordService.saveSocialPerformanceRecord(salesMan.code, req.body)

            res.status(200).send({
                apiStatus: true,
                message: "Social performance record successfully created",
                data: socialPerformanceRecordData
            });

        } catch (e) {
            const statusCode = e.status || 500;
            res.status(statusCode).send({apiStatus: false, message: e.message, data: e});
        }
    }

    // static createSalesman = async (req, res) => {
    //     try {
    //         const salesman = await salesmanService.saveSalesman(req.body)
    //         res.status(200).send({apiStatus: true, message: "Salesman created", data: salesman})
    //     } catch (e) {
    //         res.status(500).send({message: e.message, data: e})
    //     }
    // }

    // static getSalesmanById = async (req, res) => {
    //     try {
    //         const salesman = await salesmanModel.findById(req.params.id);
    //         if (salesman != null) {
    //             res.status(200).send({apiStatus: true, message: "Salesman found", data: salesman})
    //         } else {
    //             res.status(404).send({apiStatus: true, message: "Salesman not found"})
    //         }
    //
    //     } catch (e) {
    //         res.status(500).send({message: e.message, data: e})
    //     }
    // }
    // static deleteSalesman = async (req, res) => {
    //     try {
    //         const salesman = await salesmanModel.findById(req.params.id)
    //
    //         if (!salesman) {
    //             return res.status(404).send({apiStatus: false, message: "Salesman not found"});
    //         }
    //
    //         await socialPerformanceRecordModel.deleteMany({salesman_code: salesman.code});
    //
    //         await salesmanModel.deleteOne({_id: req.params.id});
    //
    //         res.status(200).send({
    //             apiStatus: true, message: "Salesman successfully deleted", data: salesman
    //         });
    //     } catch (e) {
    //         res.status(500).send({message: e.message, data: e});
    //     }
    // }
    //
    // static deleteSalesmanByCode = async (req, res) => {
    //     try {
    //         const salesman = await salesmanModel.find({code: Number(req.params.code)})
    //
    //         if (!salesman) {
    //             return res.status(404).send({apiStatus: false, message: "Salesman not found"});
    //         }
    //
    //         await socialPerformanceRecordModel.deleteMany({salesman_code: salesman.code});
    //
    //         await salesmanModel.deleteOne({code: Number(req.params.code)});
    //
    //         res.status(200).send({
    //             apiStatus: true, message: "Salesman successfully deleted", data: salesman
    //         });
    //     } catch (e) {
    //         res.status(500).send({message: e.message, data: e});
    //     }
    // }
    //
    // static updateSalesman = async (req, res) => {
    //
    //     if (req.params.id == null || req.body == null) {
    //         return res.status(400).send({message: "Invalid request parameters"});
    //     }
    //
    //     try {
    //         const salesman = await salesmanModel.findById(req.params.id)
    //         if (salesman == null) {
    //             return res.status(404).send({message: "Salesman not found"});
    //         }
    //         const newSalesman = await salesmanService.updateSalesman(salesman, req.body)
    //
    //         res.status(200).send({message: "Salesman updated", data: newSalesman});
    //
    //     } catch (e) {
    //         res.status(500).send({message: e.message, data: e});
    //     }
    // }
    //
    // static updateSalesmanByCode = async (req, res) => {
    //
    //     if (Number(req.params.code) == null || req.body == null) {
    //         return res.status(400).send({message: "Invalid request parameters"});
    //     }
    //
    //     try {
    //         const salesman = await salesmanModel.find({code: Number(req.params.code)}).exec()
    //         if (salesman == null) {
    //             return res.status(404).send({message: "Salesman not found"});
    //         }
    //         const newSalesman = await salesmanService.updateSalesman(salesman, req.body)
    //
    //         res.status(200).send({message: "Salesman updated", data: newSalesman});
    //
    //     } catch (e) {
    //         res.status(500).send({message: e.message, data: e});
    //     }
    // }

}

module.exports = salesmanApi