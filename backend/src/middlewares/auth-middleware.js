exports.checkAuthorization = (allowedRoles) => {
    return (req, res, next) => {
        if (req.session.authenticated) { // Check if session is authenticated
            if (Array.isArray(allowedRoles) && allowedRoles.includes(req.session.user.role)) {
                next(); // User is authorized; proceed to the next middleware or handler
                return;
            }
            return res.status(403).send({ error: 'Forbidden: Insufficient role permissions' }); // Role not sufficient
        }
        res.status(401).send({ error: 'Unauthorized: Authentication required' }); // Session not authenticated
    };
};