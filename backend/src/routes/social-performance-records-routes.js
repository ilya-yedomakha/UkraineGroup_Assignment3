const router = require("express").Router()
const SocialPerformanceRecordApi = require("../apis/social-performance-record-api")
const { socialPerformanceRecordValidationSchema } = require("../models/validationModels/SocialPerformanceRecordValidation");
const {checkAuthorization} = require('../middlewares/auth-middleware');


const validateSocialPerformanceRecord = (req, res, next) => {
    const { error } = socialPerformanceRecordValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.get("/", checkAuthorization(), SocialPerformanceRecordApi.getAllSocialPerformanceRecords)
router.get("/:id", checkAuthorization(), SocialPerformanceRecordApi.getSocialPerformanceRecordById)
router.get("/salesman/:salesmanCode", checkAuthorization(), SocialPerformanceRecordApi.getSocialPerformancesRecordBySalesmanCode)

router.post("/salesman/:salesmanCode", checkAuthorization(), SocialPerformanceRecordApi.createSocialPerformanceToSalesmanBySalesmanCode)
router.post("/salesman/:salesmanCode", checkAuthorization(), SocialPerformanceRecordApi.createSocialPerformanceToSalesman)

router.put("/:id", checkAuthorization(), validateSocialPerformanceRecord, SocialPerformanceRecordApi.updateSocialPerformanceRecord)

router.delete("/:id", checkAuthorization(), SocialPerformanceRecordApi.deleteSocialPerformanceRecord)
router.delete("/salesman/:salesmanCode", checkAuthorization(), SocialPerformanceRecordApi.deleteSocialPerformanceRecordBySalesmanCode)

module.exports = router