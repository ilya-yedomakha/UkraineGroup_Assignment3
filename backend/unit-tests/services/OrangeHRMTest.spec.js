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

            let data = await hrm.searchEmployeePerName( {name:'Alda'} );

            let employee = data[0];

            console.log('The employe with name: ' + employee['fullName'] + " has the following id: " + employee['employeeId']);

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

                this.get.yields(null, responseObject, JSON.stringify(responseBody));

                request.get(`${base}/api/v1/employees`, (err, res, body) => {
                    res.statusCode.should.eql(200);

                    body = JSON.parse(body);
                    body.status.should.eql('success');

                    body.data.length.should.eql(2);

                    body.data[0].should.include.keys(
                        'id', 'name'
                    );

                    body.data[0].name.should.eql('Alda');
                    done();
                });
            });
        });


    });

});

