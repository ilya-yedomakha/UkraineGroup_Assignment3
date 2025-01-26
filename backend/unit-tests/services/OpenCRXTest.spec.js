const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();
var expect = require('chai').expect;

const crx = require('./OpenCRXTester.js');


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
            identity: 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/RIYFZYC7YB65O9NXFXAROHYIO',
            firstName: 'John'
        },
        {
            identity: 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/RIYFZYC7YB65O9NXFXAROHYIB',
            firstName: 'Bob'

        },
    ]
};

describe('OpenCRX service roundtrip test', () => {

    describe('when not stubbed (use original version of openCRX)', () => {
        it('should return a single user when searching for name Alda', async function () {
            let a = await crx.connect();

            let data = await crx.getSalesManByGovernmentID(90123);

            expect(data['fullName']).to.equal("Smith, John Steven");
            expect(data['identity']).to.equal("xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/RIYFZYC7YB65O9NXFXAROHYIO");
        });

    });

    describe('when stubbed (when OpenCRX is not available', () => {
        beforeEach(() => {
            this.get = sinon.stub(request, 'get');
        });
        afterEach(() => {
            request.get.restore();
        });

        describe('GET /account', () => {
            it('should return all accounts', (done) => {

                this.get.yields(null, responseObject, JSON.stringify(responseBody));

                request.get(`${base}/account`, (err, res, body) => {
                    res.statusCode.should.eql(200);

                    body = JSON.parse(body);
                    body.status.should.eql('success');


                    body.data.length.should.eql(2);
                    body.data[0].should.include.keys(
                        'identity', 'firstName'
                    );
                    body.data[0].firstName.should.eql('John');
                    done();
                });
            });
        });


    });

});

