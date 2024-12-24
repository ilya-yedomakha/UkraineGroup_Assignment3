const router = require("express").Router()
const SocialPerformanceRecordApi = require("../apis/social-performance-record-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/", checkAuthorization(), SocialPerformanceRecordApi.getAllSocialPerformanceRecords)
router.get("/:id", checkAuthorization(), SocialPerformanceRecordApi.getSocialPerformanceRecordById)
router.get("/salesman/:salesmanCode", checkAuthorization(), SocialPerformanceRecordApi.getSocialPerformancesRecordBySalesmanCode)

router.put("/:id", checkAuthorization(), SocialPerformanceRecordApi.updateSocialPerformanceRecord)

router.delete("/:id", checkAuthorization(), SocialPerformanceRecordApi.deleteSocialPerformanceRecord)
router.delete("/salesman/:salesmanCode", checkAuthorization(), SocialPerformanceRecordApi.deleteSocialPerformanceRecordBySalesmanCode)

module.exports = router