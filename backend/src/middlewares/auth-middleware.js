exports.checkAuthorization = (allowedRoles, selfSalesman = false) => {
    return (req, res, next) => {
        // 1. Check if session is authenticated
        if (!req.session.authenticated) {
            return res.status(401).send({ error: 'Unauthorized: Authentication required' });
        }

        const userRole = req.session.user.role;
        const userCode = req.session.user.code;
        const routeCode = req.params.code ? Number(req.params.code) : null; // Get route code, if exists

        // 2. Check if user's role is in the allowed roles list
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send({ error: 'Forbidden: Insufficient role permissions' });
        }

        // 3. Handle role-specific logic for role 2 (Salesman)
        if (selfSalesman && userRole === 2) {
            if (!routeCode || userCode !== routeCode) {
                return res.status(403).send({ error: 'Forbidden: Access restricted to your own data' });
            }
        }

        // 4. All checks passed, call next middleware/handler
        return next(); // Ensure no further code is executed after this
    };
};
