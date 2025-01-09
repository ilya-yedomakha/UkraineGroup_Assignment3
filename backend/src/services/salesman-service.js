const salesmanModel = require("../models/SalesMan")
const socialPerformanceModel = require("../models/SocialPerformanceRecord")
const reportModel = require("../models/Report")

class SalesmanService{

    static calculateSalesmanBonusForSalesman = async function (salesman, salesData, socialData, year) {
        const salesmanReports = await reportModel.find({salesman_code: salesman.code});
        const reportForYear = salesmanReports.find(report => report.year === year);
        let report
        if (reportForYear) {
            report = reportForYear
            report.social_bonuses = []
            report.orders_bonuses = []
            report.salesman_code = salesman.code
            report.salesman_firstName = salesman.firstName
            report.salesman_lastName = salesman.lastName
            report.year = year
            report.total_bonus = 0
            report.employeeId = salesman.employeeId
            report.isConfirmed = false
            report.isSent = false
        } else {
            report = new reportModel()
            report.salesman_code = salesman.code
            report.salesman_firstName = salesman.firstName
            report.salesman_lastName = salesman.lastName
            report.year = year
            report.employeeId = salesman.employeeId
            report.remarks = ""
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
    /**
     * Saves data from OrangeHRM in MongoDB
     * @param salesmanFromOrangeHRM
     */
    static saveSalesmanFromOrangeHRMToDB = async function (salesmanFromOrangeHRM) {
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
                    //TODO possible errors
                    await socialPerformanceModel.deleteMany({salesman_code: element.code})
                    await reportModel.deleteMany({salesman_code: element.code})
                } else {
                    const saved = await SalesmanService.updateSalesman(element, salesman)
                    savedRecords.push(saved)
                    salesmanFromOrangeHRM = salesmanFromOrangeHRM.filter((item) => {
                        return Number(item.code) !== saved.code
                    })
                }
            }
            for (const item of salesmanFromOrangeHRM) {
                const saved = await SalesmanService.saveSalesman(item);
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

    static saveSalesman = async function (data) {
        const salesman = await salesmanModel.findOne({code: data.code})
        try {
            if (!salesman) {
                // const salesman = new salesmanModel({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     middleName: data.middleName,
                //     fullName: data.fullName,
                //     employeeId: data.employeeId,
                //     code: data.code,
                // })
                const salesman = new salesmanModel(data)
                await salesman.save()
                return salesman
            } else {
                return await SalesmanService.updateSalesman(salesman, data)
            }
        } catch (e) {
            throw new Error(e.message)
        }
    }
// TODO rework changes for salesman
    static updateSalesman = async function (oldData, newData) {
        try {
            if (newData.hasOwnProperty("firstName"))
                oldData.firstName = newData.firstName;
            if (newData.hasOwnProperty("lastName"))
                oldData.lastName = newData.lastName;
            if (newData.hasOwnProperty("middleName"))
                oldData.middleName = newData.middleName;
            if (newData.hasOwnProperty("fullName"))
                oldData.fullName = newData.fullName;
            if (newData.hasOwnProperty("employeeId"))
                oldData.employeeId = newData.employeeId;
            await oldData.save()
            return oldData
        } catch (e) {
            throw new Error(e.message)
        }
    }

    static getAllSalesman = function () {
        return salesmanModel.find()
    }
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

module.exports = SalesmanService