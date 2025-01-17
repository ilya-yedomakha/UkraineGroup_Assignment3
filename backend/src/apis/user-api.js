/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
const userService = require("../services/user-service")
const mongoose = require("mongoose");
exports.getSelf = async function(req, res){
    res.send(req.session.user); //retrieve userdata of authenticated user from session and return it
}

exports.getUsers = async function(req, res){
    var response = await userService.getAll(mongoose.connection)
    if (!response || response.length === 0) {
        res.status(404).send({apiStatus: true, message: "No users found"});
    }
    res.send({apiStatus: true, message: "Users fetched", data:response});
}

exports.getUsersCount = async function (req, res) {
    try {
        const response = await userService.getAll(mongoose.connection);

        if (!response || response.length === 0) {
            return res.status(404).send({apiStatus: true, message: "No users found"});
        }

        res.send({apiStatus: true, message: "Users count fetched", data: response.length});
    } catch (error) {
        res.status(500).send({apiStatus: false, message: "An error occurred while fetching users count", error: error.message
        });
    }
};
