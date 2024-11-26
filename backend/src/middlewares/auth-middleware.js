/**
 * this express middleware checks if a user is authenticated or even has admin permissions;
 * otherwise the request gets intercepted and status 401 is returned
 * @param {boolean} beAdmin if true, user needs to be admin
 * @return {(function(*, *, *): void)|*}
 */
exports.checkAuthorization = (beAdmin) => {
    return (req, res, next) => {
        if(req.session.authenticated){ //check if session was marked as authenticated
            if(!beAdmin || req.session.user.isAdmin){ //check if admin-requirement is met
                next(); //proceed with next middleware or handler
                return;
            }
        }
        res.status(401).send(); //intercept request
    }
}