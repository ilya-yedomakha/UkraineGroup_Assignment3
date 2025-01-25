const router = require("express").Router()
const ReportApi = require("../apis/reports-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/",
    // #swagger.tags = ['Reports']
    checkAuthorization([0, 1]), ReportApi.getAllReports)

router.get("/year/:year",
    // #swagger.tags = ['Reports']
    checkAuthorization([0, 1]), ReportApi.getAllReportsByYear)
router.get("/year/current/top10",
    // #swagger.tags = ['Reports']
    checkAuthorization([0, 1]), ReportApi.getAllReportsForCurrentYearTop10)

// for specific current selesman only (self)
router.get("/salesman/:code/year/current",
    // #swagger.tags = ['Reports']
    checkAuthorization([0, 1, 2], true), ReportApi.getReportBySalesmanCodeForCurrentYear)
//for specific current salesman only (self)
router.get("/salesman/:code",
    // #swagger.tags = ['Reports']
    checkAuthorization([0, 1, 2], true), ReportApi.getAllReportsBySalesmanCode)

router.get("/:id",
    // #swagger.tags = ['Reports']
    checkAuthorization([0, 1, 2]), ReportApi.getReportById)

router.put("/:id",
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

router.put("/hrm/stored/:id",
    //#swagger.description = 'Update Old Report'
    //#swagger.summary = 'Update Old Report'
    // #swagger.tags = ['Reports']
    /* #swagger.parameters['Report'] = {
   in: 'body',
   description: 'Update Old Report',
   type: 'object',
   required: true,
   schema: { $ref: '#/definitions/reportSchema' }
 } */
    checkAuthorization([0]), ReportApi.patchStoredInHRMSingleBonusById)

router.put("/recalculate/:id",
    //#swagger.description = 'Recalculate report'
    //#swagger.summary = 'Recalculate report'
    // #swagger.tags = ['Reports']
    checkAuthorization([0,1]), ReportApi.recalculateSingleBonusById)

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
    checkAuthorization([0,1]), ReportApi.confirmationReverseWithIdsArray)

router.put("/reverseConfirm/:id",
    //#swagger.description = 'Confirm single report'
    //#swagger.summary = 'Confirm single report'
    // #swagger.tags = ['Reports']
    checkAuthorization([0,1]), ReportApi.confirmationReverseSingleReport)

router.put("/salesman-confirm/:id",
    checkAuthorization([2]), ReportApi.confirmBonusForSalesman)

router.put("/salesman-reject/:id",
    checkAuthorization([2]), ReportApi.rejectBonusForSalesman)

router.delete("/",
    //#swagger.description = 'Delete all reports'
    //#swagger.summary = 'Delete all reports'
    // #swagger.tags = ['Reports']
    checkAuthorization([0,1]), ReportApi.deleteAllReports)

router.delete("/:id",
    //#swagger.description = 'Delete report by Id'
    //#swagger.summary = 'Delete report by Id'
    // #swagger.tags = ['Reports']
    checkAuthorization([0,1]), ReportApi.deleteReport)

router.get("/count/total",
    checkAuthorization([0,1]), ReportApi.getTotalReportsCount)

router.get("/count/year/current",
    checkAuthorization([0,1]), ReportApi.getTotalReportsForCurrentYear)

router.get("/count/signed/CEO",
    checkAuthorization([0,1]), ReportApi.getSignedByCEOReportsCount)

router.get("/count/signed/HR",
    checkAuthorization([0,1]), ReportApi.getSignedByHRReportsCount)

router.get("/count/signed/CEO/year/current",
    checkAuthorization([0,1]), ReportApi.getSignedByCEOReportsCountForCurrentYear)

router.get("/count/signed/HR/year/current",
    checkAuthorization([0,1]), ReportApi.getSignedByHRReportsCountForCurrentYear)

module.exports = router