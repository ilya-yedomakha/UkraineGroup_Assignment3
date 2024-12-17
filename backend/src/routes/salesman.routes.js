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
router.get("/testHRM", SalesManController.testOrangeHRM)
router.get("/:id", checkAuthorization(), SalesManController.getSalesmanById)
router.get("/code/:code", checkAuthorization(), SalesManController.getSalesmanByCode)
router.post("/", checkAuthorization(),  SalesManController.createSalesman)
router.put("/:id", checkAuthorization(),  SalesManController.updateSalesman)
router.put("/code/:code", checkAuthorization(),  SalesManController.updateSalesmanByCode)
router.post("/:code/social_performance", checkAuthorization(),  SalesManController.createSocialPerformanceToSalesmanBySalesmanCode)
router.delete("/:id", checkAuthorization(), SalesManController.deleteSalesman)
router.delete("/code/:code", checkAuthorization(), SalesManController.deleteSalesmanByCode)
router.post("/calculateBonuses", SalesManController.calculateAllBonuses)



module.exports = router