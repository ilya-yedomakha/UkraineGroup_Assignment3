/**
 * this model specifies the format to exchange credentials with the frontend
 * @param {string} username
 * @param {string} password
 */
class Credentials{
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

module.exports = Credentials;