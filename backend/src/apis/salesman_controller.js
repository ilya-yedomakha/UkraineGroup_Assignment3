const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salesmanService = require("../services/salesman-service")

const axios = require('axios');
const qs = require('qs');

class salesman_controller {

    static createSalesman = async (req, res) => {
        try {
            const salesman = await salesmanService.saveSalesman(req.body)
            res.status(200).send({apiStatus: true, message: "Salesman created", data: salesman})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

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

    static getAllSalesmen = async (req, res) => {
        try {
            const salesman = await salesmanService.getAllSalesman();
            res.status(200).send({apiStatus: true, message: "All salesmen fetched", data: salesman})
        } catch (e) {
            res.status(500).send({message: e.message, data: e})
        }
    }

    static deleteSalesman = async (req, res) => {
        try {
            const salesman = await salesmanModel.findById(req.params.id)

            if (!salesman) {
                return res.status(404).send({apiStatus: false, message: "Salesman not found"});
            }

            await socialPerformanceRecordModel.deleteMany({salesman_id: salesman._id});

            await salesmanModel.deleteOne({_id: req.params.id});

            res.status(200).send({
                apiStatus: true, message: "Salesman successfully deleted", data: salesman
            });
        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }


    static createSocialPerformanceToSalesman = async (req, res) => {
        try {
            const salesMan = await salesmanModel.findById(req.params.id)

            if (salesMan == null) {
                return res.status(404).send({message: "Salesman with id" + req.params.id + " not found"})
            }

            const socialPerformanceRecordData = new socialPerformanceRecordModel({
                salesman_id: req.params.id, ...req.body
            })
            let savedSocialPerformanceRecord = await socialPerformanceRecordData.save()
            await socialPerformanceRecordData.save()
            salesMan.performance_record_ids.push(savedSocialPerformanceRecord._id)

            await salesMan.save()

            res.status(200).send({
                apiStatus: true,
                message: "Social performance record successfully created",
                data: salesMan
            });

        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    }


    static updateSalesman = async (req, res) => {

        if (req.params.id == null || req.body == null) {
            return res.status(400).send({message: "Invalid request parameters"});
        }

        try {
            const salesman = await salesmanModel.findById(req.params.id)
            if (salesman == null) {
                return res.status(404).send({message: "Salesman not found"});
            }
            salesman.firstName = req.body.first_name;
            salesman.lastName = req.body.last_name;

            await salesman.save();

            res.status(200).send({message: "Salesman updated", data: salesman});

        } catch (e) {
            res.status(500).send({message: e.message, data: e});

        }
    }



    static testOrangeHRM = async (req, res) => {
        try {
            // Step 1: Get the access_token
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
                return res.status(500).send({ message: 'Access token not found in response' });
            }

            // Step 2: Use the access_token to fetch employee data
            const employeeResponse = await axios.get(
                'http://localhost:8888/symfony/web/index.php/api/v1/employee/search',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // Step 3: Filter employees with jobTitle "Senior Salesman"
            const employees = employeeResponse.data.data || []; // Safely access 'data' field
            const filteredEmployees = employees.filter(
                (employee) => employee.jobTitle === 'Senior Salesman'
            );

            try {
                const savedEmployees = await salesmanService.saveSalesmanFromOrangeHRMToDB(filteredEmployees);
                return res.status(200).send({ message: 'Data saved successfully', savedEmployees });
            } catch (e) {
                return res.status(500).send({ message: 'Error saving data', error: e.message });
            }

        } catch (e) {
            res.status(500).send({ message: e.message, data: e });
        }
    };


}

module.exports = salesman_controller