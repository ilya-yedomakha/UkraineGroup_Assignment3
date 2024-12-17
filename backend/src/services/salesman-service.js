const salesmanModel = require("../models/SalesMan")
const reportModel = require("../models/Report")

exports.calculateSalesmanBonusForSalesman = async function (salesman, salesData, socialData) {
    const salesmanReports = await reportModel.find({salesman_code: salesman.code});

    let report = new reportModel()
    report.salesman_code = salesman.code
    report.salesman_firstname = salesman.firstName
    report.salesman_lastname = salesman.lastName
    //todo перед тим як передавати дані сюди, відфільтрувати щоб був цей рік
    let totalBonus = 0;
    socialData.forEach(({_id, target_value, actual_value}) => {
        let relation = actual_value - target_value;
        const currBonus = socialBonusCoefficient(relation)
        report.social_bonuses.push({bonus: currBonus})
        totalBonus += currBonus
    });
    // priority 1-5 = coeffs 0,0,25,50,100
    // clientRating 1-5 = coefs 100, 50, 25, 0, 0
    // {positionQuantity * positionPricePerUnit} *0.1 or 0.05
    // productName
    salesData.forEach(({
                           _id,
                           priority,
                           clientFullName,
                           clientRating,
                           positionQuantity,
                           positionPricePerUnit,
                           productName
                       }) => {
        const tempBonus = priorityCoefficient(priority) + clientRatingCoefficient(clientRating) + positionQuantity * positionPricePerUnit * 0.1;
        report.orders_bonuses.push({
            productName: productName,
            clientFullName: clientFullName,
            clientRating: clientRating,
            positionQuantity: positionQuantity,
            bonus: tempBonus
        })
        totalBonus += tempBonus
    })
    report.total_bonus = totalBonus
    // salesmanReports.forEach(())
    await report.save()
    return totalBonus
}

function priorityCoefficient(priority) {
    switch (priority) {
        case 5:
            return 100;
        case 4:
            return 50;
        case 3:
            return 25;
        default:
            return 0
    }
}
function clientRatingCoefficient(clientRating) {
    switch (clientRating) {
        case 1:
            return 100;
        case 2:
            return 50;
        case 3:
            return 25;
        default:
            return 0
    }
}

function socialBonusCoefficient(relation) {
    switch (true) {
        case relation === -2:
            return 10;
        case relation === -1:
            return 20;
        case relation === 0:
            return 50;
        case relation > 0:
            return 100;
        default:
            return 0;
    }
}

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