/**
 * marks user's session as authenticated
 * @param session current session
 * @param {User} user information about the current user
 */
exports.authenticate = function (session, user){
    session.authenticated = true;
    delete user.password;
    session.user = user;
}

/**
 * checks session, if user is authenticated
 * @param session current session
 * @return {boolean} true if user is authenticated
 */
exports.isAuthenticated = function (session){
    return session.authenticated ? true : false;
}

/**
 * resets session to a 'non-authenticated' state
 * @param session current session
 */
exports.deAuthenticate = function (session){
    session.authenticated = false;
    session.user = undefined;
    session = null;
}