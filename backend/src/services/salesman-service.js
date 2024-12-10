const salesmanModel = require("../models/SalesMan")
const res = require("express/lib/response");

/**
 * Saves data from OrangeHRM in MongoDB
 * @param salesmanFromOrangeHRM
 * @returns {Promise<void>}
 */
exports.saveSalesmanFromOrangeHRMToDB = async function (salesmanFromOrangeHRM) {
    const savedRecords = [];
    const errors = [];

    for (const item of salesmanFromOrangeHRM) {
        try {
            const saved = await save(item);
            savedRecords.push(saved);
        } catch (e) {
            console.error(`Error saving record: ${item.employeeId}`, e.message); // Лог помилки
            errors.push({ employeeId: item.employeeId, error: e.message }); // Збираємо інформацію про помилки
        }
    }
    if (errors.length > 0) {
        console.error('Some records failed to save:', errors);
    }
    return savedRecords;
}

exports.saveSalesman = async function (data) {
    try {
        return await save(data)
    }catch (e) {
        throw new Error(e.message)
    }
}

exports.getAllSalesman = function(){
    return salesmanModel.find()
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