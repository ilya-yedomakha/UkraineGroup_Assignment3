const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();
var expect = require('chai').expect;

const hrm = require('./OrangeHRMTesterWithAxios.js');

const base = 'http://localhost:1337';

const responseObject = {
    statusCode: 200,
    headers: {
        'content-type': 'application/json'
    }
};

const responseBody = {
    status: 'success',
    data: [
        {
            id: 4,
            name: 'Alda'
        },
        {
            id: 5,
            name: 'Miller'

        },
    ]
};


describe('OrangeHRM service roundtrip test', () => {

    describe('when not stubbed (use original version of OrangeHRM)', () => {
        it('should return a single user when searching for name Alda', async function () {
            await hrm.connect();

            // first look for a user with last name "Alda"
            let data = await hrm.searchEmployeePerName( {name:'Alda'} );

            // An array with objects is received. Well, with one object! We get this one at index '0'
            let employee = data[0];

            // console.log( data );
            console.log('The employe with name: ' + employee['fullName'] + " has the following id: " + employee['employeeId']);

            // some tests with Chai:
            expect(employee['fullName']).to.equal("Sascha Alda");
            expect(employee['employeeId']).to.equal("8");
        });

    });

    describe('when stubbed (when OrangeHRM is not available', () => {
        beforeEach(() => {
            this.get = sinon.stub(request, 'get');
        });
        afterEach(() => {
            request.get.restore();
        });

        describe('GET /api/v1/employees', () => {
            it('should return all employees', (done) => {

                // Specify the behaviour with the yields-method
                this.get.yields(null, responseObject, JSON.stringify(responseBody));

                // Send the request to the mocked API (get was replaced!)
                request.get(`${base}/api/v1/employees`, (err, res, body) => {
                    // there should be a 200 status code
                    res.statusCode.should.eql(200);

                    // parse response body
                    body = JSON.parse(body);
                    // the JSON response body should have a
                    // key-value pair of {"status": "success"}
                    body.status.should.eql('success');

                    // the JSON response body should have a
                    // key-value pair of {"data": [2 employee objects]}
                    body.data.length.should.eql(2);
                    // the first object in the data array should
                    // have the right keys
                    body.data[0].should.include.keys(
                        'id', 'name'
                    );
                    // the first object should have the right value for name
                    body.data[0].name.should.eql('Alda');
                    done();
                });
            });
        });


    });

});

