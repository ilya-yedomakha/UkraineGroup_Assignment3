const router = require("express").Router()
const ReportApi = require("../apis/reports-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/",
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.getAllReports)

router.get("/year/:year",
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.getAllReportsByYear)

router.get("/salesman/:code",
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.getAllReportsBySalesmanCode)

router.get("/:id",
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.getReportById)

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
    checkAuthorization(), ReportApi.updateReport)

router.put("/:id/submit",
    //#swagger.description = 'Submit Report'
    //#swagger.summary = 'Submit Report'
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.submitReport)

router.put("/:id/unSubmit",
    //#swagger.description = 'Unsubmit Report'
    //#swagger.summary = 'Unsubmit Report'
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.unSubmitReport)

router.put("/submit",
    //#swagger.description = 'Submit all Reports'
    //#swagger.summary = 'Submit all Reports'
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.submitAllReports)

router.put("/unSubmit",
    //#swagger.description = 'Unsubmit all Reports'
    //#swagger.summary = 'Unsubmit all Reports'
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.unSubmitAllReports)

router.delete("/",
    //#swagger.description = 'Delete all reports'
    //#swagger.summary = 'Delete all reports'
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.deleteAllReports)

router.delete("/:id",
    //#swagger.description = 'Delete report by Id'
    //#swagger.summary = 'Delete report by Id'
    // #swagger.tags = ['Reports']
    checkAuthorization(), ReportApi.deleteReport)

module.exports = router