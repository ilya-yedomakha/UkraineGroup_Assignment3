const salesmanModel = require("../models/SalesMan")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")

const axios = require('axios');

let environment;
if(process.env.NODE_ENV === 'development'){
    environment = require('../../environments/environment.js').default;
}else{
    environment = require('../../environments/environment.prod.js').default;
}

class sale_performance_record_controller {
    static importSalePerformanceDataFromOpenCRX = async (req, res) => {
        try {
            const response = await axios.get(
                'http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder',
                {
                    auth: {
                        username: environment.openCRXUsername,
                        password: environment.passwordCRX,
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            const salesOrders = response.data.objects;

            const salesPerformanceRecords = [];
            const hasNaNFields = (record) => {
                return Object.values(record).some((value) =>
                    value === null || value === undefined || Number.isNaN(value)
                );
            };

            for (const salesOrder of salesOrders) {
                const href = salesOrder["@href"];

                const positionResponse = await axios.get(
                    `${href}/position`,
                    {
                        auth: {
                            username: environment.openCRXUsername,
                            password: environment.passwordCRX,
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
                            username: environment.openCRXUsername,
                            password: environment.passwordCRX,
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const salesman = salesmanResponse.data;

                    const clientResponse = await axios.get(clientHref["@href"], {
                        auth: {
                            username: environment.openCRXUsername,
                            password: environment.passwordCRX,
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const client = clientResponse.data;

                    const productResponse = await axios.get(productHref["@href"], {
                        auth: {
                            username: environment.openCRXUsername,
                            password: environment.passwordCRX,
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    const product = productResponse.data;

                    salesPerformanceRecords.push({
                        "salesOrderName": salesOrder.name,
                        "activeYear": Number(new Date(salesOrder.activeOn).getUTCFullYear()),
                        "priority": salesOrder.priority,
                        "clientFullName": client.fullName,
                        "positionName": position.name,
                        "positionNumber": position.positionNumber,
                        "positionPricePerUnit": position.pricePerUnit,
                        "positionQuantity": position.quantity,
                        "positionPricingStatus": position.pricingState,
                        "productNumber": product.productNumber,
                        "productName": product.name,
                    });
                }
            }

            const currentYear = new Date().getUTCFullYear();

            const filteredRecords = salesPerformanceRecords.filter(
                (record) => record.activeYear === currentYear
            );

            await salePerformanceRecordModel.deleteMany({});
            await salePerformanceRecordModel.insertMany(filteredRecords);

            res.status(200).send({filteredRecords});
        } catch (e) {
            res.status(500).send({ message: e.message, data: e });
        }
    };


}

module.exports = sale_performance_record_controller