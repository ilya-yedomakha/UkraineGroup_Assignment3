const router = require("express").Router()
const SalePerformanceRecordApi = require("../apis/sale-performance-records-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.get("/import-from-openCRX",
    //#swagger.description = 'Import sale performance form OpenCRX'
    //#swagger.summary = 'Import sale performance form OpenCRX'
    // #swagger.tags = ['Sales Performance']
    checkAuthorization(), SalePerformanceRecordApi.importSalePerformanceDataFromOpenCRX)
module.exports = router