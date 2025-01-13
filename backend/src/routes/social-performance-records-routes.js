const router = require("express").Router()
const SocialPerformanceRecordApi = require("../apis/social-performance-record-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/",
    // #swagger.tags = ['Social Performance']
    //#swagger.description = 'Get all social performance records'
    //#swagger.summary = 'Get all social performance records'
    checkAuthorization([0,1]), SocialPerformanceRecordApi.getAllSocialPerformanceRecords)

router.get("/:id",
    //#swagger.description = 'Get social performance record by id'
    //#swagger.summary = 'Get social performance record by id'
    // #swagger.tags = ['Social Performance']
    checkAuthorization([0,1]), SocialPerformanceRecordApi.getSocialPerformanceRecordById)
//todo specific current salesman (self)
router.get("/salesman/:code",
    //#swagger.description = 'Get social performance record by salesman code'
    //#swagger.summary = 'Get social performance record by salesman code'
    // #swagger.tags = ['Social Performance']
    checkAuthorization([0,1,2], true), SocialPerformanceRecordApi.getSocialPerformancesRecordBySalesmanCode)

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
    checkAuthorization([0,1]), SocialPerformanceRecordApi.updateSocialPerformanceRecord)

router.delete("/:id",
    //#swagger.description = 'Delete social performance record'
    //#swagger.summary = 'Delete social performance record'
    // #swagger.tags = ['Social Performance']
    checkAuthorization([0,1]), SocialPerformanceRecordApi.deleteSocialPerformanceRecord)
router.delete("/salesman/:salesmanCode",
    //#swagger.description = 'Delete social performance record by salesman code'
    //#swagger.summary = 'Delete social performance record by salesman code'
    // #swagger.tags = ['Social Performance']
    checkAuthorization([0,1]), SocialPerformanceRecordApi.deleteSocialPerformanceRecordBySalesmanCode)

module.exports = router