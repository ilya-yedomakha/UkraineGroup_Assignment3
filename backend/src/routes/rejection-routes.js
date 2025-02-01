const router = require("express").Router();
const RejectionMessageApi = require("../apis/rejection-message-api");
const {checkAuthorization} = require('../middlewares/auth-middleware');

router.post("/report/:reportId",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Create rejection message'
    // #swagger.summary = 'Create rejection message'
    /* #swagger.parameters['Rejection message'] = {
        in: 'body',
        description: 'Create rejection message',
        type: 'object',
        required: true,
        schema: { message: "" }
    } */
    checkAuthorization([2]), RejectionMessageApi.save);

router.get("/:id",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Get rejection message by id'
    // #swagger.summary = 'Get rejection message by id'
    checkAuthorization([2]), RejectionMessageApi.getById);

router.get("/salesman/:code",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Get rejection messages by salesman code'
    // #swagger.summary = 'Get rejection messages by salesman code'
    checkAuthorization([0, 1, 2]), RejectionMessageApi.getForSalesman);

router.get("/year/:year",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Get rejection messages by year'
    // #swagger.summary = 'Get rejection messages by year'
    checkAuthorization([0, 1]), RejectionMessageApi.getByYear);

router.get("/year/current/count",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Get count of rejection messages by year'
    // #swagger.summary = 'Get count of rejection messages by year'
    checkAuthorization([0, 1]), RejectionMessageApi.getByCurrentYearCount);

router.delete("/:id",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Delete rejection message'
    // #swagger.summary = 'Delete rejection message'
    checkAuthorization([2]), RejectionMessageApi.deleteById);

router.delete("/report/:reportId/",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Delete rejection message by report id'
    // #swagger.summary = 'Delete rejection message by report id'
    checkAuthorization([2]), RejectionMessageApi.deleteByReport);

router.delete("/salesman/:code",
    // #swagger.tags = ['Rejection']
    // #swagger.description = 'Delete rejection message by salesman code'
    // #swagger.summary = 'Delete rejection message by salesman code'
    checkAuthorization([2]), RejectionMessageApi.deleteBySalesmanCode);

module.exports = router;