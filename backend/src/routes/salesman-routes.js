const router = require("express").Router()
const SalesManController = require("../apis/salesman-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/", checkAuthorization(), SalesManController.getAllSalesmen)
router.get("/testHRM", SalesManController.importSeniorSalesmenFromOrangeHRM)
router.get("/:id", checkAuthorization(), SalesManController.getSalesmanById)
router.get("/code/:code", checkAuthorization(), SalesManController.getSalesmanByCode)

router.post("/", checkAuthorization(),  SalesManController.createSalesman)
router.post("/calculateBonuses", SalesManController.calculateAllBonuses)
router.post("/sendBonuses", SalesManController.sendAllBonusesToHRM)

router.put("/:id", checkAuthorization(),  SalesManController.updateSalesman)
router.put("/code/:code", checkAuthorization(),  SalesManController.updateSalesmanByCode)

router.delete("/:id", checkAuthorization(), SalesManController.deleteSalesman)
router.delete("/code/:code", checkAuthorization(), SalesManController.deleteSalesmanByCode)

module.exports = router