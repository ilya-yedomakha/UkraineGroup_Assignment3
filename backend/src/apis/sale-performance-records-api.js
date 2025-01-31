const salePerformanceRecordModel = require("../models/SalePerformanceRecord")

const axios = require('axios');

let environment;
if(process.env.NODE_ENV === 'development'){
    environment = require('../../environments/environment.js').default;
}else{
    environment = require('../../environments/environment.prod.js').default;
}

class salePerformanceRecordApi {
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
                    const {salesRep: salesmanHref, customer: clientHref} = salesOrder;
                    const {product: productHref} = position;

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

                    let record = {
                        "salesOrderName": salesOrder.name,
                        "activeYear": Number(new Date(salesOrder.activeOn).getUTCFullYear()),
                        "priority": salesOrder.priority,
                        "salesmanHref": salesman["@href"],
                        "salesmanGovId": salesman.governmentId,
                        "clientHref": client["@href"],
                        "clientRating": client.accountRating,
                        "clientFullName": client.fullName,
                        "positionHref": position["@href"],
                        "positionLineItemNumber": position.lineItemNumber,
                        "positionName": position.name,
                        "positionNumber": position.positionNumber,
                        "positionPricePerUnit": position.pricePerUnit,
                        "items": position.quantity,
                        "positionPricingStatus": position.pricingState,
                        "positionBaseAmount": position.baseAmount,
                        "positionDiscountAmount": position.discountAmount,
                        "positionTaxAmount": position.taxAmount,
                        "positionTotalAmountInclTax": position.amount,
                        "productHref": product["@href"],
                        "productNumber": product.productNumber,
                        "productName": product.name,
                    };

                    if (!hasNaNFields(record)) {
                        salesPerformanceRecords.push(record);
                    }
                }
            }

            await salePerformanceRecordModel.deleteMany({});
            await salePerformanceRecordModel.insertMany(salesPerformanceRecords);

            if (salesPerformanceRecords.length > 0) {
                res.status(200).send({apiStatus: true, message:"Sale performances from OpenCRX", data: salesPerformanceRecords});
            } else {
                res.status(404).send({apiStatus: true, message:"There are no suitable sale orders to fetch"});
            }
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e});
        }
    };

    static getAllSalePerformance = async (req, res) => {
        try {
            const salesman = await salePerformanceRecordModel.find();
            res.status(200).send({apiStatus: true, message: "All sales data fetched", data: salesman})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    };

    static getAllSalePerformanceCountForCurrentYear = async (req, res) => {
        try {
            const salesman = await salePerformanceRecordModel.countDocuments({activeYear: new Date().getFullYear()});
            res.status(200).send({apiStatus: true, message: "All sales data fetched", data: salesman})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    };

    static getAllSalePerformancesBySalesmanCode = async (req, res) => {
        try {
            const saleOrder = await salePerformanceRecordModel.find({salesmanGovId: req.params.code});
            res.status(200).send({apiStatus: true, message: "All sales data fetched for salesman: "+ req.params.code, data: saleOrder})
        } catch (e) {
            res.status(500).send({apiStatus: false, message: 'Server error, try again later', data: e})
        }
    };

}

module.exports = salePerformanceRecordApi