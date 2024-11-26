const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));

const authService = require('../../src/services/auth-service');
const User = require("../../src/models/User");

const demouser = new User('testuser', 'John', 'Doe', 'jd@test.com', 'secret', false);

describe('auth-service unit-tests', function (){
    describe('auth session test', function (){
        it('user stored in session', function (){
            const session = {};
            authService.authenticate(session, demouser);
            expect(session.user).to.excluding('password').be.eqls(demouser);
        });

        it('session marked as authenticated', function (){
            const session = {};
            authService.authenticate(session, demouser);
            expect(session.authenticated).to.be.true;
        });
    });

    describe('auth state check test', function (){
        it('true if session is marked as authenticated', function (){
            const session = {authenticated: true};
            expect(authService.isAuthenticated(session)).to.be.true;
        });

        it('false if session is marked as not authenticated', function (){
            const session = {authenticated: false};
            expect(authService.isAuthenticated(session)).to.be.false;
        });

        it('false if session is not marked', function (){
            const session = {};
            expect(authService.isAuthenticated(session)).to.be.false;
        });
    });

    describe('auth state reset test', function (){
        it('reset session to null', function (){
            let session = {
                authenticated: true,
                user: demouser
            };
            authService.deAuthenticate(session);
            expect(session.authenticated).to.not.be.true;
            expect(session.user).to.be.oneOf([undefined, null]);
        });
    });
});