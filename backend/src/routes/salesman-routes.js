const router = require("express").Router()
const SalesManController = require("../apis/salesman-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/", checkAuthorization(), SalesManController.getAllSalesmen)
router.get("/import-from-orangeHRM", SalesManController.importSeniorSalesmenFromOrangeHRM)
router.get("/:code", checkAuthorization(), SalesManController.getSalesmanByCode)

// router.post("/", checkAuthorization(), SalesManController.createSalesman)
router.post("/calculate-bonuses", checkAuthorization(), SalesManController.calculateAllBonuses)
router.post("/send-bonuses-orangeHRM", checkAuthorization(), SalesManController.sendAllBonusesToHRM)

// router.put("/:id", checkAuthorization(),  SalesManController.updateSalesman)
// router.put("/code/:code", checkAuthorization(),  SalesManController.updateSalesmanByCode)
//
// router.delete("/:id", checkAuthorization(), SalesManController.deleteSalesman)
// router.delete("/code/:code", checkAuthorization(), SalesManController.deleteSalesmanByCode)

module.exports = router