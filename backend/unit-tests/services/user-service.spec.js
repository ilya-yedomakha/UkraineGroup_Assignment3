const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const userService = require('../../src/services/user-service');
const User = require("../../src/models/User");
const crypto = require("crypto");
const Credentials = require("../../src/models/Credentials");
const {copyObject} = require("../support/copyObject");

const demouser = new User('testuser', 'John', 'Doe', 'jd@test.com', 'secret', false);
const demouser2 = new User('testuser2', 'Jane', 'Doe', 'jad@test.com', 'xyz', false);

let db;

describe('auth-service unit-tests', function (){
    before(async function (){
        db = await initMockedMongoDB();
    });
    afterEach(function (){
        resetMockedMongoDB(db);
    });
    after(function (){
        closeMockedMongoDB(db);
    });

    describe('user creation tests', function (){
        it('insert user to db', async function (){
            await userService.add(db, copyObject(demouser));
            await expect(db.collection('users').findOne()).to.eventually.excluding(['_id', 'password']).be.eqls(demouser);
        });

        it('expect correct objectId to be returned', async function (){
            const oid = await userService.add(db, copyObject(demouser));
            await expect(db.collection('users').findOne()).to.eventually.have.property('_id', oid);
        });

        it('create matching hash of user\'s password', async function (){
            await userService.add(db, copyObject(demouser)); //simple deep-copy using json
            const insertedUser = await db.collection('users').findOne();

            let hash = crypto.createHmac('sha3-256', 'integrationArchitectures');
            hash.update(demouser.password);

            expect(insertedUser).to.have.property('password', hash.digest('base64'));
        });
    });

    describe('user lookup tests', function (){
        it('expect correct user to found', async function (){
            await db.collection('users').insert([demouser, demouser2]);
            await expect(userService.get(db, demouser.username)).to.eventually.excluding('_id').be.eqls(demouser);
        });

        it('expect null when user not found', async function (){
            await expect(userService.get(db, 'username')).to.eventually.be.null;
        });
    });

    describe('credential verification test', function (){
        it('expect user to be returned if credentials match', async function (){
            const demouser_copy = copyObject(demouser);

            let hash = crypto.createHmac('sha3-256', 'integrationArchitectures');
            hash.update(demouser.password);
            demouser_copy.password = hash.digest('base64');

            await db.collection('users').insertOne(demouser_copy);
            await expect(userService.verify(db, new Credentials(demouser.username, demouser.password))).to.eventually.excluding(['_id', 'password']).be.eqls(demouser);
        });

        it('expect error to be thrown if user does not exist', async function (){
            await expect(userService.verify(db, new Credentials(demouser.username, demouser.password))).to.eventually.be.rejectedWith(Error);
        });

        it('expect error to be thrown if password does not match', async function (){
            await db.collection('users').insertOne(demouser);
            await expect(userService.verify(db, new Credentials(demouser.username, demouser.password+'abc'))).to.eventually.be.rejectedWith(Error);
        });
    });
});