const router = require("express").Router()
const SocialPerformanceRecordApi = require("../apis/social-performance-record-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/",
    // #swagger.tags = ['Social Performance']
    //#swagger.description = 'Get all social performance records'
    //#swagger.summary = 'Get all social performance records'
    checkAuthorization(), SocialPerformanceRecordApi.getAllSocialPerformanceRecords)
router.get("/:id",
    //#swagger.description = 'Get social performance record by id'
    //#swagger.summary = 'Get social performance record by id'
    // #swagger.tags = ['Social Performance']
    checkAuthorization(), SocialPerformanceRecordApi.getSocialPerformanceRecordById)
router.get("/salesman/:salesmanCode",
    //#swagger.description = 'Get social performance record by salesman code'
    //#swagger.summary = 'Get social performance record by salesman code'
    // #swagger.tags = ['Social Performance']
    checkAuthorization(), SocialPerformanceRecordApi.getSocialPerformancesRecordBySalesmanCode)

router.put("/:id",
    //#swagger.description = 'Update social performance record'
    //#swagger.summary = 'Update social performance record'
    // #swagger.tags = ['Social Performance']
    /* #swagger.parameters['Social Performance'] = {
   in: 'body',
   description: 'Update social performance',
   type: 'object',
   required: true,
   schema: { $ref: '#/definitions/socialPerformanceRecordSchema' }
 } */
    checkAuthorization(), SocialPerformanceRecordApi.updateSocialPerformanceRecord)

router.delete("/:id",
    //#swagger.description = 'Delete social performance record'
    //#swagger.summary = 'Delete social performance record'
    // #swagger.tags = ['Social Performance']
    checkAuthorization(), SocialPerformanceRecordApi.deleteSocialPerformanceRecord)
router.delete("/salesman/:salesmanCode",
    //#swagger.description = 'Delete social performance record by salesman code'
    //#swagger.summary = 'Delete social performance record by salesman code'
    // #swagger.tags = ['Social Performance']
    checkAuthorization(), SocialPerformanceRecordApi.deleteSocialPerformanceRecordBySalesmanCode)

module.exports = router