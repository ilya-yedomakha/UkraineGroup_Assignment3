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
            throw new Error(e.message)
        }
    }
}

exports.saveSalesman = async function (data) {
    try {
        return await save(data)
    }catch (e) {
        throw new Error(e.message)
    }
}

exports.getSalesman = async function(){
    return await salesmanModel.find();
}

async function save(data) {
    try {
        const salesman = new salesmanModel({
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            fullName: data.fullName,
            employeeId: data.employeeId,
            code: data.code,
        })
        await salesman.save()
        return salesman
    } catch (e) {
        throw new Error(e)
    }
}