const salesmanModel = require("../models/SalesMan")
const socialPerformanceModel = require("../models/SocialPerformanceRecord")
const reportModel = require("../models/Report")

class SalesmanService{

    static calculateSalesmanBonusForSalesman = async function (salesman, salesData, socialData, year) {
        const salesmanReports = await reportModel.find({salesman_code: salesman.code});
        const reportForYear = salesmanReports.find(report => report.year === year);
        let report
        if (reportForYear) {
            if(reportForYear.isConfirmedByCEO){
                // Don't touch if it's confirmed
                return reportForYear.totalBonus;
            }
            report = reportForYear
            report.socialBonuses = []
            report.ordersBonuses = []
            report.salesman_code = salesman.code
            report.firstname = salesman.firstName
            report.lastname = salesman.lastName
            report.year = year
            report.totalBonus = 0
            report.employeeId = salesman.employeeId
            report.isConfirmedByCEO = false
            report.isConfirmedBySalesman = false
            report.isConfirmedByHR = false
            report.isRemarkConfirmedByHR = false
            report.isSent = false
        } else {
            report = new reportModel()
            report.salesman_code = salesman.code
            report.firstname = salesman.firstName
            report.lastname = salesman.lastName
            report.year = year
            report.employeeId = salesman.employeeId
            report.remarks = ""
        }
        let totalBonus = 0;
        socialData.forEach(({target_value, actual_value, goal_description}) => {
            let relation = actual_value - target_value;
            const currBonus = socialBonusCoefficient(relation)
            report.socialBonuses.push({
                target_value: target_value,
                actual_value: actual_value,
                goal_description: goal_description,
                initialBonus: currBonus,
                bonus: currBonus
            })
            totalBonus += currBonus
        });
        // priority 1-5 = coeffs 0,0,25,50,100
        // clientRating 1-5 = coefs 100, 50, 25, 0, 0
        // {items * positionPricePerUnit} *0.1 or 0.05
        // productName
        salesData.forEach(({
                               priority,
                               clientFullName,
                               clientRating,
                               items,
                               positionPricePerUnit,
                               productName
                           }) => {
            const tempBonus = priorityCoefficient(priority) + clientRatingCoefficient(clientRating) + items * positionPricePerUnit * 0.1;
            report.ordersBonuses.push({
                productName: productName,
                clientFullName: clientFullName,
                clientRating: clientRating,
                items: items,
                initialBonus: tempBonus,
                bonus: tempBonus
            })
            totalBonus += tempBonus
        })
        report.totalBonus = totalBonus

        await report.save()
        return report
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

    static updateSalesman = async function (oldData, newData) {
        try {
            if (newData.hasOwnProperty("firstName"))
                oldData.firstName = newData.firstName;
            if (newData.hasOwnProperty("lastName"))
                oldData.lastName = newData.lastName;
            if (newData.hasOwnProperty("middleName"))
                oldData.middleName = newData.middleName;
            if (newData.hasOwnProperty("fullName"))
                oldData.fullName = newData.fullName
            if (newData.hasOwnProperty("employeeId"))
                oldData.employeeId = newData.employeeId
            if (newData.hasOwnProperty("nationality"))
                oldData.nationality = newData.nationality
            if (newData.hasOwnProperty("dob"))
                oldData.dob = newData.dob
            if (newData.hasOwnProperty("maritalStatus"))
                oldData.maritalStatus = newData.maritalStatus
            if (newData.hasOwnProperty("gender"))
                oldData.gender = newData.gender
            if (newData.hasOwnProperty("unit"))
                oldData.unit = newData.unit
            if (newData.hasOwnProperty("jobTitle"))
                oldData.jobTitle = newData.jobTitle
            if (newData.hasOwnProperty("workEmail"))
                oldData.workEmail = newData.workEmail
            if (newData.hasOwnProperty("workTelephone"))
                oldData.workTelephone = newData.workTelephone
            ;
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