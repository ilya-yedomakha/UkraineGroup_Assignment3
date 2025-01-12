const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login',
    // #swagger.tags = ['Authentication']
    //    #swagger.description = 'Log in'
    //     #swagger.summary = 'Log in'
    /* #swagger.parameters['User credentials'] = {
   in: 'body',
   description: 'Login with your credentials',
   type: 'object',
   required: true,
   schema: { $ref: '#/definitions/userSchema' }
 } */
    authApi.login); //the function decides which request type should be accepted
router.delete('/login',
    /* #swagger.tags = ['Authentication']
    #swagger.description = 'Log out'
    #swagger.summary = 'Log out'
    */
    checkAuthorization([0]), authApi.logout); //middlewares can be defined in parameters
router.get('/login',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Check if logged in'
    //#swagger.summary = 'Check if logged in'
    authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Get current user data'
    //#swagger.summary = 'Get current user data'
    checkAuthorization([0]), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Get all people'
    //#swagger.summary = 'Get all people'
    checkAuthorization([0]), peopleDemoApi.getPeople);

module.exports = router;