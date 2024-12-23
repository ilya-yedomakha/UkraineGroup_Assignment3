const router = require("express").Router()
const SalePerformanceRecordApi = require("../apis/sale-performance-records-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');


// const validateSocialPerformanceRecord = (req, res, next) => {
//     const { error } = socialPerformanceRecordValidationSchema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }
//     next();
// };

// router.get("/", checkAuthorization(), SocialPerformanceRecordController.getAllSocialPerformanceRecords)
// router.get("/:id", checkAuthorization(), SocialPerformanceRecordController.getSocialPerformanceRecordById)
// router.put("/:id", checkAuthorization(), validateSocialPerformanceRecord, SocialPerformanceRecordController.updateSocialPerformanceRecord)
// router.delete("/:id", checkAuthorization(), SocialPerformanceRecordController.deleteSocialPerformanceRecord)
router.get("/", checkAuthorization, SalePerformanceRecordApi.importSalePerformanceDataFromOpenCRX)
module.exports = router