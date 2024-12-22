const router = require("express").Router()
const SalePerformanceRecordController = require("../apis/sale_performance_records_controller")
// const { salePerformanceRecordValidationSchema } = require("../models/validationModels/SocialPerformanceRecordValidation");
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
router.get("/", SalePerformanceRecordController.importSalePerformanceDataFromOpenCRX)
module.exports = router