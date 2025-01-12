const router = require("express").Router()
const ReportApi = require("../apis/reports-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/",
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.getAllReports)

router.get("/year/:year",
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.getAllReportsByYear)

router.get("/salesman/:code/year/current",
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.getReportBySalesmanCodeForCurrentYear)

router.get("/salesman/:code",
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.getAllReportsBySalesmanCode)

router.get("/:id",
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.getReportById)

router.patch("/:id",
    //#swagger.description = 'Update Report'
    //#swagger.summary = 'Update Report'
    // #swagger.tags = ['Reports']
    /* #swagger.parameters['Report'] = {
   in: 'body',
   description: 'Update Report',
   type: 'object',
   required: true,
   schema: { $ref: '#/definitions/reportSchema' }
 } */
    checkAuthorization([0]), ReportApi.updateReport)

router.put("/:id/submit",
    //#swagger.description = 'Submit Report'
    //#swagger.summary = 'Submit Report'
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.submitReportByCEO)

router.put("/:id/unSubmit",
    //#swagger.description = 'Unsubmit Report'
    //#swagger.summary = 'Unsubmit Report'
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.unSubmitReportByCEO)

router.put("/submit",
    //#swagger.description = 'Submit all Reports'
    //#swagger.summary = 'Submit all Reports'
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.submitAllReportsByCEO)

router.put("/submit/confirmationArrayReverse",
    //#swagger.description = 'Reverse array'
    //#swagger.summary = 'Reverse array'
    // #swagger.tags = ['Reports']
    /* #swagger.parameters['Report'] = {
   in: 'body',
   description: 'Reverse array',
   type: 'object',
   required: true,
   schema: { $ref: '#/definitions/reverseArray' }
 } */
    checkAuthorization([0]), ReportApi.confirmationReverseWithIdsArray)

// router.put("/submit/confirmationPairCEO",
//     //#swagger.description = 'confirmationPairCEO'
//     //#swagger.summary = 'confirmationPairCEO'
//     // #swagger.tags = ['confirmationPairCEO']
//     /* #swagger.parameters['confirmationPairCEO'] = {
//    in: 'body',
//    description: 'confirmationPairCEO',
//    type: 'object',
//    required: true,
//    schema: { $ref: '#/definitions/confirmationPairCEO' }
//  } */
//     checkAuthorization([0]), ReportApi.confirmationPairsArrayByCEO)

router.put("/unSubmit",
    //#swagger.description = 'Unsubmit all Reports'
    //#swagger.summary = 'Unsubmit all Reports'
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.unSubmitAllReportsByCEO)

router.delete("/",
    //#swagger.description = 'Delete all reports'
    //#swagger.summary = 'Delete all reports'
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.deleteAllReports)

router.delete("/:id",
    //#swagger.description = 'Delete report by Id'
    //#swagger.summary = 'Delete report by Id'
    // #swagger.tags = ['Reports']
    checkAuthorization([0]), ReportApi.deleteReport)

module.exports = router