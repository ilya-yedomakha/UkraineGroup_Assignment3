// noinspection LanguageDetectionInspection

const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")

const salesmanService = require("../services/salesman-service")

const axios = require('axios');
const qs = require('qs');

//TODO Ще подумайте над тим, як працювати з полем SaleOrder: Active/Valid from:
// 2/12/2018, 12:57:44 PM. Оскільки бонуси розраховуються для поточного року.

class sale_performance_record_controller {
    static testOpenCRX = async (req, res) => {
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
                        "positionQuantity": position.quantity,
                        "positionPricingStatus": position.pricingState,
                        "positionBaseAmount": position.baseAmount,
                        "positionDiscountAmount": position.discountAmount,
                        "positionTaxAmount": position.taxAmount,
                        "positionTotalAmountInclTax": position.amount,
                        "productHref": product["@href"],
                        "productNumber": product.productNumber,
                        "productName": product.name,
                    });
                }
            }

            await salePerformanceRecordModel.insertMany(salesPerformanceRecords);

            res.status(200).send({ salesPerformanceRecords });
        } catch (e) {
            res.status(500).send({ message: e.message, data: e });
        }
    };


}

module.exports = sale_performance_record_controller