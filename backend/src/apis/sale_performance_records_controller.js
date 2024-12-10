const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const salesmanService = require("../services/salesman-service")

const axios = require('axios');
const qs = require('qs');

class sale_performance_record_controller {
    static testOpenCRX = async (req, res) => {
        try {
            // Replace with the appropriate base URL and authentication if needed
            const response = await axios.get(
                'http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder',
                {
                    auth: {
                        username: 'guest',
                        password: 'guest',
                    },
                }
            );

            // Send back the response data to Postman
            res.status(200).send(response.data);
        } catch (e) {
            res.status(500).send({message: e.message, data: e});
        }
    };

}

module.exports = sale_performance_record_controller