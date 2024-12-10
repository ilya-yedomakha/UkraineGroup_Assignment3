const salesmanModel = require("../models/SalesMan")
const socialPerformanceRecordModel = require("../models/SocialPerformanceRecord")
const salePerformanceRecordModel = require("../models/SalePerformanceRecord")
const salesmanService = require("../services/salesman-service")

const axios = require('axios');
const qs = require('qs');

//TODO зроби так, щоб по масиву salesOrderPositions проходилось форічем і робило запити в кожному рядку і вписувались дані про продукт, продавця і
// клієнта і зберегти це все в таблицю salePerformance-ів І додати поточний рік. Ще подумайте над тим, як працювати з полем SaleOrder: Active/Valid from:
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

            const salesOrderPositions = [];

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
                positions.forEach((position) => {
                    salesOrderPositions.push({
                        "salePerformanceHref": salesOrder["@href"],
                        "salesOrderName": salesOrder.name,
                        "priority": salesOrder.priority,
                        "salesmanHref": salesOrder.salesRep,
                        "clientHref": salesOrder.customer,
                        "positionHref": position["@href"],
                        "positionNumber": position.positionNumber,
                        "positionLineItemNumber": position.lineItemNumber,
                        "positionName": position.name,
                        "positionPricePerUnit": position.pricePerUnit,
                        "positionQuantity": position.quantity,
                        "positionPricingStatus": position.pricingState,
                        "positionBaseAmount": position.baseAmount,
                        "positionDiscountAmount": position.discountAmount,
                        "positionTaxAmount": position.taxAmount,
                        "positionTotalAmountInclTax": position.amount,
                        "productHref": position.product


                    });
                });
            }

            res.status(200).send({ salesOrderPositions });
        } catch (e) {
            res.status(500).send({ message: e.message, data: e });
        }
    };




}

module.exports = sale_performance_record_controller