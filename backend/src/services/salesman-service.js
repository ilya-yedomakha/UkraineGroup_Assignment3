const salesmanModel = require("../models/SalesMan")
const res = require("express/lib/response");

/**
 * Saves data from OrangeHRM in MongoDB
 * @param salesmanFromOrangeHRM
 * @returns {Promise<void>}
 */
exports.saveSalesmanFromOrangeHRMToDB = async function (salesmanFromOrangeHRM) {
    for (const item of salesmanFromOrangeHRM) {
        try {
            await save(item)
        } catch (e) {
            throw new Error(e)
        }
    }
}

exports.saveSalesman = async function (data) {
    return save(data)
}

exports.getSalesman = function(){
    return salesmanModel.find();
}

async function save(data) {
    let salesman
    try {
        salesman = new salesmanModel({
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            fullName: data.fullName,
            employeeId: data.employeeId,
            code: data.code,
        })
        await salesman.save()
    } catch (e) {
        throw new Error(e)
    }
    return salesman
}