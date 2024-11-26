const crypto = require('crypto');
const salt = 'integrationArchitectures';

/**
 * inserts a new user into database & hashes its password
 * @param db target database
 * @param {User} user new user
 * @return {Promise<any>}
 */
exports.add = async function (db, user){
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