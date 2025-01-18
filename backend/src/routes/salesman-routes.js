const router = require("express").Router()
const SalesManController = require("../apis/salesman-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');
const SocialPerformanceRecordApi = require("../apis/social-performance-record-api");
const salesmanModel = require("../models/SalesMan");

router.get("/",
    //#swagger.description = 'Get all salesmen'
    //#swagger.summary = 'Get All salesmen'
    // #swagger.tags = ['Salesmen']
    checkAuthorization([0,1]), SalesManController.getAllSalesmen)
router.get("/import-from-orangeHRM",
    //#swagger.description = 'Import senior salesman from OrangeHRM'
    //#swagger.summary = 'Import senior salesman from OrangeHRM'
    // #swagger.tags = ['Salesmen']
    checkAuthorization([0,1]), SalesManController.importSeniorSalesmenFromOrangeHRM)
router.get("/:code",
    //#swagger.description = 'Get salesman by code'
    //#swagger.summary = 'Get salesman by code'
    // #swagger.tags = ['Salesmen']
    checkAuthorization([0,1,2],true), SalesManController.getSalesmanByCode)

// router.post("/", checkAuthorization([0]), SalesManController.createSalesman)
router.post("/calculate-bonuses",
    //#swagger.description = 'Calculate all bonuses'
    //#swagger.summary = 'Calculate all bonuses'
    // #swagger.tags = ['Salesmen']
    checkAuthorization([0,1]), SalesManController.calculateAllBonuses)
router.post("/send-bonuses-orangeHRM",
    //#swagger.description = 'Send all bonuses to OrangeHRM'
    //#swagger.summary = 'Send all bonuses to OrangeHRM'
    // #swagger.tags = ['Salesmen']
    checkAuthorization([0,1]), SalesManController.sendAllBonusesToHRM)

router.post("/:code/social_performance_record",
    //#swagger.description = 'Create social performance record'
    //#swagger.summary = 'Create social performance record'
    // #swagger.tags = ['Salesmen']
    /* #swagger.parameters['Social Performance'] = {
in: 'body',
description: 'Create social performance',
type: 'object',
required: true,
schema: { $ref: '#/definitions/socialPerformanceRecordSchema' }
} */
    checkAuthorization([0,1]), SalesManController.createSocialPerformanceToSalesmanBySalesmanCode)

router.get("/count/total",
    //#swagger.description = 'Get all salesmen'
    //#swagger.summary = 'Get All salesmen'
    // #swagger.tags = ['Salesmen']
    checkAuthorization([0,1]), SalesManController.getAllSalesmenCount)

module.exports = router