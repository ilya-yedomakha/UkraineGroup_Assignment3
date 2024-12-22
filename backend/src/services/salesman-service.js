const salesmanModel = require("../models/SalesMan")
const reportModel = require("../models/Report")

exports.calculateSalesmanBonusForSalesman = async function (salesman, salesData, socialData, year) {
    const salesmanReports = await reportModel.find({salesman_code: salesman.code});
    reportForYear = salesmanReports.find(report => report.year === year);
    let report
    let for_upd = false
    if (reportForYear) {
        report = reportForYear
        report.social_bonuses =[]
        report.orders_bonuses =[]
        report.salesman_code = salesman.code
        report.salesman_firstName = salesman.firstName
        report.salesman_lastName = salesman.lastName
        report.year = year
        report.total_bonus = 0
        report.employeeId = salesman.employeeId
    } else {
        report = new reportModel()
        report.salesman_code = salesman.code
        report.salesman_firstName = salesman.firstName
        report.salesman_lastName = salesman.lastName
        report.year = year
        report.employeeId = salesman.employeeId
    }
    let totalBonus = 0;
    socialData.forEach(({target_value, actual_value, goal_description}) => {
        let relation = actual_value - target_value;
        const currBonus = socialBonusCoefficient(relation)
        report.social_bonuses.push({
            target_value: target_value,
            actual_value: actual_value,
            goal_description: goal_description,
            bonus: currBonus
        })
        totalBonus += currBonus
    });
    // priority 1-5 = coeffs 0,0,25,50,100
    // clientRating 1-5 = coefs 100, 50, 25, 0, 0
    // {positionQuantity * positionPricePerUnit} *0.1 or 0.05
    // productName
    salesData.forEach(({
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
 */
exports.saveSalesmanFromOrangeHRMToDB = async function (salesmanFromOrangeHRM) {
    const savedRecords = [];
    const errors = [];
    const salesmanFromDB = await salesmanModel.find()

    try {
        for (const element of salesmanFromDB) {
            const salesman = salesmanFromOrangeHRM.find((item) => {
                return Number(item.code) === element.code
            })
            if (!salesman) {
                await salesmanModel.findByIdAndDelete(element._id)
            } else {
                const saved = await update(element, salesman)
                savedRecords.push(saved)
                salesmanFromOrangeHRM = salesmanFromOrangeHRM.filter((item) => {
                    return Number(item.code) !== saved.code
                })
            }
        }
        for (const item of salesmanFromOrangeHRM) {
            const saved = await save(item);
            savedRecords.push(saved);
        }
    } catch (e) {
        errors.push({error: e.message});
    }

    if (errors.length > 0) {
        console.error('Some records failed to save:', errors);
    }
    return savedRecords;
}

exports.saveSalesman = async function (data) {
    const salesman = await salesmanModel.findOne({code: data.code})
    try {
        if (!salesman) {
            return await save(data)
        } else {
            return await update(salesman, data)
        }
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.updateSalesman = async function (oldData, newData) {
    try {
        return await update(oldData, newData)
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.getAllSalesman = function () {
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

async function update(salesman, newData) {
    try {
        if (newData.hasOwnProperty("firstName"))
            salesman.firstName = newData.firstName;
        if (newData.hasOwnProperty("lastName"))
            salesman.lastName = newData.lastName;
        if (newData.hasOwnProperty("middleName"))
            salesman.middleName = newData.middleName;
        if (newData.hasOwnProperty("fullName"))
            salesman.fullName = newData.fullName;
        if (newData.hasOwnProperty("employeeId"))
            salesman.employeeId = newData.employeeId;
        await salesman.save()
        return salesman
    } catch (e) {
        throw new Error(e)
    }
}

function findSalesmanByCode(code) {
    const salesman = salesmanModel.find({code: code})
    if (!salesman) {
        return null
    } else {
        return salesman
    }
}
