const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")

class salesman_controller {

    static createSalesman = async (req, res) => {
        try {
            const salesman = new salesmanModel({
                first_name: req.body.first_name, last_name: req.body.last_name,
            })
            await salesman.save()
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
            const salesman = await salesmanModel.find()
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

            res.status(200).send({apiStatus: true, message: "Social performance record successfully created", data: salesMan});

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
            salesman.first_name = req.body.first_name;
            salesman.last_name = req.body.last_name;

            await salesman.save();

            res.status(200).send({message: "Salesman updated", data: salesman});

        } catch (e) {
            res.status(500).send({message: e.message, data: e});

        }
    }


}

module.exports = salesman_controller