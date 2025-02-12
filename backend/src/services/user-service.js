const crypto = require('crypto');
const salt = 'integrationArchitectures';

exports.edit = async function (db, user){
    user.password = hashPassword(user.password);

    return (await db.collection('users').insertOne(user)).insertedId; //return unique ID
}

/**
 * retrieves user from database by its username
 * @param db source database
 * @param {string} username
 * @return {Promise<User>}
 */
exports.get = async function (db, username){
    return db.collection('users').findOne({username: username});
}

exports.add = async function (db, user) {
    user.password = hashPassword(user.password);
    return (await db.collection('users').insertOne(user)).insertedId;
};

exports.update = async function (db, code, updates) {
    if (updates.password) {
        updates.password = hashPassword(updates.password);
    }
    return db.collection('users').updateOne({ code: code }, { $set: updates });
};

exports.delete = async function (db, code) {
    return await db.collection('users').deleteOne({ code: Number(code) });
};

exports.getAll = async function (db) {
    return db.collection('users').find({}).toArray();
};

exports.getByCode = async function (db, code){
    return db.collection('users').findOne({code: Number(code)});
}

exports.changePassword = async function (db, code, oldPassword, newPassword) {
    const user = await db.collection('users').findOne({code: Number(code)});

    if (!user) {
        throw new Error("User not found!");
    }

    if (!verifyPassword(oldPassword, user.password)) {
        throw new Error("Old password is incorrect!");
    }

    const hashedNewPassword = hashPassword(newPassword);
    await db.collection("users").updateOne({code: Number(code)}, { $set: { password: hashedNewPassword } });

    return { message: "Password updated successfully" };
};


/**
 * verifies provided credentials against a database
 * @param db source database
 * @param {Credentials} credentials credentials to verify
 * @return {Promise<User>}
 */
exports.verify = async function (db, credentials){
    let user = await this.get(db, credentials.username); //retrieve user with given email from database

    if(!user) throw new Error('User was not found!'); //no user found -> throw error
    if(!verifyPassword(credentials.password, user.password)) throw new Error('Password wrong!');

    return user;
}

/**
 * hashes password with sha3 256bit
 * @param {string} password
 * @return {string} hashed password
 */
function hashPassword(password){
    let hash = crypto.createHmac('sha3-256', salt);
    hash.update(password);
    return hash.digest('base64');
}

/**
 * verifies password against hash
 * @param {string} password password to verify
 * @param {string} hash hash of expected password
 * @return {boolean} true if password matches
 */
function verifyPassword(password, hash){
    return hashPassword(password) === hash; //verify by comparing hashes
}