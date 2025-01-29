/**
 * endpoint, which returns information about the user, which is currently authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
const userService = require("../services/user-service")
const mongoose = require("mongoose");
const generator = require('generate-password');
const {default: environment_ilya} = require("../../environments/environment_ilya");
const salesmanModel = require("../models/SalesMan");
const nodemailer = require("nodemailer");
exports.getSelf = async function (req, res) {
    res.send(req.session.user); //retrieve userdata of authenticated user from session and return it
}

exports.getUsers = async function (req, res) {
    var response = await userService.getAll(mongoose.connection)
    if (!response || response.length === 0) {
        res.status(404).send({apiStatus: true, message: "No users found"});
    }
    res.send({apiStatus: true, message: "Users fetched", data: response});
}

exports.getUsersByCode = async function (req, res) {
    var response = await userService.getByCode(mongoose.connection, req.params.code);
    if (!response) {
        res.status(404).send({apiStatus: true, message: "No users found"});
    }
    res.send({apiStatus: true, message: "Users fetched", data: response});
}

exports.getUsersCount = async function (req, res) {
    try {
        const response = await userService.getAll(mongoose.connection);

        if (!response || response.length === 0) {
            return res.status(404).send({apiStatus: true, message: "No users found"});
        }

        res.send({apiStatus: true, message: "Users count fetched", data: response.length});
    } catch (error) {
        res.status(500).send({
            apiStatus: false, message: "An error occurred while fetching users count", error: error.message
        });
    }
};

exports.addUser = async function (req, res) {
    try {
        const user = req.body;

        const requiredFields = ['username', 'firstname', 'lastname', 'email', 'role', 'code'];
        const missingFields = requiredFields.filter(field => !user[field]);

        if (missingFields.length > 0) {
            return res.status(400).send({
                apiStatus: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const duplicate = await mongoose.connection.collection('users').findOne({
            $or: [{username: user.username}, {email: user.email}, {code: user.code}]
        });

        if (duplicate) {
            const conflictingFields = [];
            if (duplicate.username === user.username) conflictingFields.push('username');
            if (duplicate.email === user.email) conflictingFields.push('email');
            if (duplicate.code === user.code) conflictingFields.push('code');

            return res.status(400).send({
                apiStatus: false,
                message: `The following fields already exist: ${conflictingFields.join(', ')}`
            });
        }
        user.role = Number(user.role);

        if (!user.hasOwnProperty('password')) {

            if (environment_ilya) {
                password = generator.generate({
                    length: 10,
                    numbers: true
                })
                user.password = password;
                await userService.add(mongoose.connection, user);

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: environment_ilya.user,
                        pass: environment_ilya.pass,
                    },
                });

                const mailOptions = {
                    from: "CEO@gmail.com",
                    to: user.email,
                    subject: "Your account was created! Here is your password:",
                    text: password,
                };

                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        return res.status(500).json({error: "Failed to send email."});
                    } else {
                        return res.status(200).json({
                            apiStatus: true,
                            message: "Email with password sent successfully and user was created.",
                            data: info.response,
                        });
                    }
                });
            } else {
                user.password = '1234'
                const userId = await userService.add(mongoose.connection, user);
                res.status(201).send({
                    apiStatus: true,
                    message: "User added successfully (Email can be sent only if SMTP is available (test password))",
                    data: {id: userId}
                });
            }


        } else {
            const userId = await userService.add(mongoose.connection, user);
            res.status(201).send({
                apiStatus: true,
                message: "User added successfully",
                data: {id: userId}
            });
        }

    } catch (error) {
        res.status(500).send({
            apiStatus: false,
            message: "An error occurred while adding the user",
            error: error.message
        });
    }
};

exports.updateUser = async function (req, res) {
    try {
        const updates = req.body;
        const code = req.params.code;

        const user = await userService.getByCode(mongoose.connection, code);
        if (!user) {
            return res.status(404).send({
                apiStatus: false,
                message: `User with code '${code}' not found`
            });
        }

        const requiredFields = ['username', 'firstname', 'lastname', 'email', 'role', 'code'];
        const missingFields = requiredFields.filter(field => !updates[field]);

        if (missingFields.length > 0) {
            return res.status(400).send({
                apiStatus: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const duplicate = await mongoose.connection.collection('users').findOne({
            $or: [{username: updates.username}, {email: updates.email}, {code: updates.code}],
            code: {$ne: updates.code}
        });

        if (duplicate) {
            const conflictingFields = [];
            if (duplicate.username === updates.username) conflictingFields.push('username');
            if (duplicate.email === updates.email) conflictingFields.push('email');
            if (duplicate.code === updates.code) conflictingFields.push('code');

            return res.status(400).send({
                apiStatus: false,
                message: `The following fields already exist for another user: ${conflictingFields.join(', ')}`
            });
        }

        user.role = Number(user.role);

        const result = await userService.update(mongoose.connection, updates.code, updates);

        res.send({
            apiStatus: true,
            message: "User updated successfully",
            data: result
        });
    } catch (error) {
        res.status(500).send({
            apiStatus: false,
            message: "An error occurred while updating the user",
            error: error.message
        });
    }
};
exports.deleteUser = async function (req, res) {
    try {
        const code = req.params.code;

        if (!code) {
            return res.status(400).send({
                apiStatus: false,
                message: "Missing required parameter: code"
            });
        }

        const user = await userService.getByCode(mongoose.connection, code);
        if (!user) {
            return res.status(404).send({
                apiStatus: false,
                message: `User with code '${code}' not found`
            });
        }

        await userService.delete(mongoose.connection, code);

        res.send({
            apiStatus: true,
            message: `User with code '${code}' deleted successfully`
        });
    } catch (error) {
        res.status(500).send({
            apiStatus: false,
            message: "An error occurred while deleting the user",
            error: error.message
        });
    }
};
