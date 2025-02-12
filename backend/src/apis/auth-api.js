const userService = require('../services/user-service')
const authService = require('../services/auth-service');
// const jwt = require('jsonwebtoken');
//
// let environment;
// if(process.env.NODE_ENV === 'development'){
//     environment = require('../../environments/environment.js').default;
// }else{
//     environment = require('../../environments/environment.prod.js').default;
// }

/**
 * endpoint, which handles login
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.login = function (req, res) {

    const db = req.app.get('db');//get database from express

    userService.verify(db, req.body).then(user => { //verify credentials via user-service
        authService.authenticate(req.session, user); //mark session as authenticated
        // const token = jwt.sign({user.username}, environment.SECRET_KEY, {expiresIn: '1h'});
        // res.send({message: 'login successful', token: token});
        res.status(200).send('Login successful');
    }).catch(_ => {
        res.status(401).send('Login failed');
    })
}

/**
 * endpoint, which handles logout
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.logout = function (req, res) {
    authService.deAuthenticate(req.session); //destroy session
    res.status(200).send({apiStatus: true, message: 'logout successful'});
}

/**
 * endpoint, which returns whether a user is authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.isLoggedIn = function (req, res) {
    if (authService.isAuthenticated(req.session)) { //check via auth-service
        res.send({loggedIn: true, role: req.session.user.role});
    } else {
        res.send({loggedIn: false, role: null});
    }
}