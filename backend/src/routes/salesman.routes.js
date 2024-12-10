const router = require("express").Router()
const { salesManValidationSchema } = require("../models/validationModels/SalesManValidation");
const { socialPerformanceRecordValidationSchema } = require("../models/validationModels/SocialPerformanceRecordValidation");
const SalesManController = require("../apis/salesman_controller")
const {checkAuthorization} = require('../middlewares/auth-middleware');

const validateSalesManInput = (req, res, next) => {
    const { error } = salesManValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};


const validateSocialPerformanceRecord = (req, res, next) => {
    const { error } = socialPerformanceRecordValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.get("/", checkAuthorization(), SalesManController.getAllSalesmen)
// router.get("/testCRX", SalesManController.testOpenCRX)
router.get("/testHRM", SalesManController.testOrangeHRM)
router.get("/:id", checkAuthorization(), SalesManController.getSalesmanById)
router.post("/", checkAuthorization(), validateSalesManInput, SalesManController.createSalesman)
router.put("/:id", checkAuthorization(), validateSalesManInput, SalesManController.updateSalesman)
router.post("/:id/social_performance", checkAuthorization(), validateSocialPerformanceRecord, SalesManController.createSocialPerformanceToSalesman)
router.delete("/:id", checkAuthorization(), SalesManController.deleteSalesman)



module.exports = router