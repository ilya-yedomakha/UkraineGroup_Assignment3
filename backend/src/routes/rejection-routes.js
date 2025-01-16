const router = require("express").Router();
const RejectionMessageApi = require("../apis/rejection-message-api");
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.post("/report/:reportId",
    checkAuthorization([2]), RejectionMessageApi.save);

router.get("/:id",
    checkAuthorization([2]), RejectionMessageApi.getById);

router.get("/salesman/:code",
    checkAuthorization([2]), RejectionMessageApi.getForSalesman);

router.get("/year/:year",
    checkAuthorization([0, 1]), RejectionMessageApi.getByYear);

router.delete("/:id",
    checkAuthorization([2]), RejectionMessageApi.deleteById);

router.delete("/report/:reportId/",
    checkAuthorization([2]), RejectionMessageApi.deleteByReport);

router.delete("/salesman/:code",
    checkAuthorization([2]), RejectionMessageApi.deleteBySalesmanCode);

module.exports = router;