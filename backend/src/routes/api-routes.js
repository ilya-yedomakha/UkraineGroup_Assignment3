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
    authApi.logout); //middlewares can be defined in parameters
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
    checkAuthorization([0,1,2]), userApi.getSelf);

router.get('/users',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Get current user data'
    //#swagger.summary = 'Get current user data'
    checkAuthorization([0,1]), userApi.getUsers);

router.get('/users/:code',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Get single user by code'
    //#swagger.summary = 'Get single user by code'
    checkAuthorization([0,1]), userApi.getUsersByCode);

router.get('/users/total/count',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Get current user data'
    //#swagger.summary = 'Get current user data'
    checkAuthorization([0,1]), userApi.getUsersCount);
router.get('/users/salesmen/codes',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Get list of free salesman codes'
    //#swagger.summary = 'Get list of free salesman codes'
    checkAuthorization([0,1]), userApi.getFreeSalesmenCodesList);

router.post('/users',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Create user'
    //#swagger.summary = 'Create user'
    /* #swagger.parameters['Users'] = {
in: 'body',
description: 'Create user account',
type: 'object',
required: true,
schema: { $ref: '#/definitions/userCreationSchema' }
} */
    checkAuthorization([0,1]), userApi.addUser);

router.put('/users/:code',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Update user'
    //#swagger.summary = 'Update user'
    /* #swagger.parameters['Users'] = {
in: 'body',
description: 'Update user account',
type: 'object',
required: true,
schema: { $ref: '#/definitions/userCreationSchema' }
} */
    checkAuthorization([0,1]), userApi.updateUser);


router.put('/users/password/change/',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Update user password'
    //#swagger.summary = 'Update user password'
    /* #swagger.parameters['Users'] = {
in: 'body',
description: 'Update user account password',
type: 'object',
required: true,
schema: { $ref: '#/definitions/userPasswordChangeSchema' }
} */
    checkAuthorization([0,1,2]), userApi.changePassword);

router.delete('/users/:code',
    // #swagger.tags = ['Authentication']
    //#swagger.description = 'Delete user'
    //#swagger.summary = 'Delete user'
    checkAuthorization([0,1]), userApi.deleteUser);

// const peopleDemoApi = require('../apis/people-demo-api');
// router.get('/people',
//     // #swagger.tags = ['Authentication']
//     //#swagger.description = 'Get all people'
//     //#swagger.summary = 'Get all people'
//     checkAuthorization([0]), peopleDemoApi.getPeople);

module.exports = router;