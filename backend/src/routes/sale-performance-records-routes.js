const router = require("express").Router()
const SalePerformanceRecordApi = require("../apis/sale-performance-records-api")
const {checkAuthorization} = require('../middlewares/auth-middleware');
const salePerformanceRecordModel = require("../models/SalePerformanceRecord");

router.get("/import-from-openCRX",
    //#swagger.description = 'Import sale performance form OpenCRX'
    //#swagger.summary = 'Import sale performance form OpenCRX'
    // #swagger.tags = ['Sales Performance']
    checkAuthorization([0,1]), SalePerformanceRecordApi.importSalePerformanceDataFromOpenCRX)

router.get("/",
    //#swagger.description = 'get all sales order'
    //#swagger.summary = 'get all sales order'
    // #swagger.tags = ['get all sales order']
    checkAuthorization([0,1]), SalePerformanceRecordApi.getAllSalePerformance)

router.get("/count/year/current",
    //#swagger.description = 'get all sales order for current year'
    //#swagger.summary = 'get all sales order for current year'
    // #swagger.tags = ['get all sales order for current year']
    checkAuthorization([0,1]), SalePerformanceRecordApi.getAllSalePerformanceCountForCurrentYear)

router.get("/salesman/:code",
    //#swagger.description = 'get all sales order for specific salesman'
    //#swagger.summary = 'get all sales order for specific salesman'
    // #swagger.tags = ['get all sales order for specific salesman']
    checkAuthorization([0,1,2],true), SalePerformanceRecordApi.getAllSalePerformancesBySalesmanCode)
module.exports = router