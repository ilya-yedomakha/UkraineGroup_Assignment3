// noinspection LanguageDetectionInspection

const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")

const salesmanService = require("../services/salesman-service")

const axios = require('axios');
const qs = require('qs');


class sale_performance_record_controller {
    static importSalePerformanceDataFromOpenCRX = async (req, res) => {
        try {
            const response = await axios.get(
                'http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder',
                {
                    auth: {
                        username: 'guest',
                        password: 'guest',
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            const salesOrders = response.data.objects;

            const salesPerformanceRecords = [];

            for (const salesOrder of salesOrders) {
                const href = salesOrder["@href"];

                const positionResponse = await axios.get(
                    `${href}/position`,
                    {
                        auth: {
                            username: 'guest',
                            password: 'guest',
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                const positions = positionResponse.data.objects || [];
                for (const position of positions) {
                    const { salesRep: salesmanHref, customer: clientHref } = salesOrder;
                    const { product: productHref } = position;

                    const salesmanResponse = await axios.get(salesmanHref["@href"], {
                        auth: {
                            username: 'guest',
                            password: 'guest',
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const salesman = salesmanResponse.data;

                    const clientResponse = await axios.get(clientHref["@href"], {
                        auth: {
                            username: 'guest',
                            password: 'guest',
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const client = clientResponse.data;

                    const productResponse = await axios.get(productHref["@href"], {
                        auth: {
                            username: 'guest',
                            password: 'guest',
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const product = productResponse.data;

                    salesPerformanceRecords.push({
                        "salePerformanceHref": salesOrder["@href"],
                        "salesOrderName": salesOrder.name,
                        "activeYear": Number(new Date(salesOrder.activeOn).getUTCFullYear()),
                        "priority": salesOrder.priority,
                        "salesmanHref": salesman["@href"],
                        "clientFullName": client.fullName,
                        "positionName": position.name,
                        "positionNumber": position.positionNumber,

                        "positionTotalAmountInclTax": position.amount,
                        "productHref": product["@href"],
                        "productNumber": product.productNumber,
                        "productName": product.name,
                    });
                }
            }

            const currentYear = new Date().getUTCFullYear();

            const filteredRecords = salesPerformanceRecords.filter(
                (record) => record.activeYear === currentYear
            );

            await salePerformanceRecordModel.insertMany(filteredRecords);

            res.status(200).send({ filteredRecords });
        } catch (e) {
            res.status(500).send({ message: e.message, data: e });
        }
    };


}

module.exports = sale_performance_record_controller