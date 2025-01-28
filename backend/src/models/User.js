class User{
    constructor(username, firstname, lastname, email, password, role, code) {
        this._id = undefined;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.code = code;
    }
}

module.exports = User;