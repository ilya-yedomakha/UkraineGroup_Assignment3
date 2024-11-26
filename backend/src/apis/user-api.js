/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getSelf = async function(req, res){
    res.send(req.session.user); //retrieve userdata of authenticated user from session and return it
}