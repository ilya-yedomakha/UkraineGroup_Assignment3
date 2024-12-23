const router = require("express").Router()
const SalePerformanceRecordApi = require("../apis/sale-performance-records-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/import-from-openCRX", checkAuthorization(), SalePerformanceRecordApi.importSalePerformanceDataFromOpenCRX)
module.exports = router