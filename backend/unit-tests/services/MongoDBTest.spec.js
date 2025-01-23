const db = require('./MongoDBTester');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const socialPerformanceRecordModel = require('../../src/models/SocialPerformanceRecord');
const salePerformanceRecordModel = require('../../src/models/SalePerformanceRecord');

describe('MongoDB service roundtrip test', () => {

    describe('when not stubbed (use original version of MongoDB)', () => {

        before(async () => {
            await db.connect();
        });

        describe('SocialPerformanceRecords', () => {
            describe('getAllSocialPerformanceRecords', () => {
                it('should return all social performance records', async () => {
                    const data = await db.getAllSocialPerformanceRecords();
                    expect(data).to.be.an('array');
                });
            });

            describe('getSocialPerformancesRecordBySalesmanCode', () => {
                it('should return social performance records by salesman code', async () => {
                    const code = 90732;
                    const data = await db.getSocialPerformancesRecordBySalesmanCode(code);
                    expect(data).to.be.an('array');
                    expect(data[0].salesman_code).to.equal(90732);
                });
            });

            describe('getSocialPerformanceRecordById', () => {
                it('should return a social performance record by ID', async () => {
                    const mockRecord = await db.insertSocialPerformanceRecord({
                        goal_description: 'Communication Skills',
                        target_value: 5,
                        actual_value: 4,
                        year: 2023,
                        salesman_code: 90732
                    });

                    const data = await db.getSocialPerformanceRecordById(mockRecord._id);
                    expect(data).to.have.property('goal_description', 'Communication Skills');
                    await db.deleteSocialPerformanceRecord(mockRecord._id);
                });
            });

            describe('insertSocialPerformanceRecord', () => {
                it('should insert a social performance record', async () => {
                    const record = {
                        goal_description: 'Leadership Competence',
                        target_value: 4,
                        actual_value: 3,
                        year: 2023,
                        salesman_code: 90733
                    };
                    const data = await db.insertSocialPerformanceRecord(record);
                    expect(data).to.have.property('goal_description', 'Leadership Competence');
                    await db.deleteSocialPerformanceRecord(record._id);
                });
            });

            describe('updateSocialPerformanceRecord', () => {
                it('should update a social performance record by ID', async () => {
                    const mockRecord = await db.insertSocialPerformanceRecord({
                        goal_description: 'Openness to Employee',
                        target_value: 3,
                        actual_value: 2,
                        year: 2023,
                        salesman_code: 90734
                    });

                    const updates = {actual_value: 5};
                    const updatedRecord = await db.updateSocialPerformanceRecord(mockRecord._id, updates);
                    expect(updatedRecord).to.have.property('actual_value', 5);
                    await db.deleteSocialPerformanceRecord(mockRecord._id);
                });
            });
        });

        describe('SalePerformance', () => {
            describe("getAllSalePerformance", () => {
                it("should fetch all sale performance records", async () => {
                    const data = await db.getAllSalePerformance();
                    expect(data).to.be.an("array");
                });
            });

            describe("getAllSalePerformanceCountForCurrentYear", () => {
                it("should count sale performance records for the current year", async () => {
                    const count = await db.getAllSalePerformanceCountForCurrentYear();
                    expect(count).to.be.a("number");
                });
            });

            describe("getAllSalePerformancesBySalesmanCode", () => {
                it("should fetch sale performance records by salesman code", async () => {
                    const code = 12345;
                    const data = await db.getAllSalePerformancesBySalesmanCode(code);
                    expect(data).to.be.an("array");
                    if (data.length > 0) {
                        expect(data[0]).to.have.property("salesmanGovId", code);
                    }
                });
            });
        });
    });


    describe('when stubbed (when MongoDB is not available)', () => {

        let stub;

        afterEach(() => {
            sinon.restore();
        });

        describe('SocialPerformanceRecords', () => {
            describe('get Social Performance Records By Salesman Code', () => {
                it('should return mocked data when searching by salesman code', async () => {
                    const mockData = [
                        {
                            goal_description: 'Mock Goal',
                            target_value: 5,
                            actual_value: 4,
                            year: 2023,
                            salesman_code: 90732
                        }
                    ];

                    stub = sinon.stub(socialPerformanceRecordModel, 'find').returns(Promise.resolve(mockData));

                    const data = await db.getSocialPerformancesRecordBySalesmanCode(90732);
                    expect(data).to.be.an('array');
                    expect(data[0].goal_description).to.equal('Mock Goal');
                    expect(data[0].salesman_code).to.equal(90732);
                });
            });

            describe('insertSocialPerformanceRecord', () => {
                it('should simulate inserting a social performance record', async () => {
                    const mockData = {
                        _id: 'mockid12345',
                        goal_description: 'Leadership Competence',
                        target_value: 4,
                        actual_value: 3,
                        year: 2023,
                        salesman_code: 90733
                    };

                    stub = sinon.stub(socialPerformanceRecordModel.prototype, 'save').returns(Promise.resolve(mockData));

                    const data = await db.insertSocialPerformanceRecord(mockData);
                    expect(data).to.have.property('goal_description', 'Leadership Competence');
                    expect(data).to.have.property('salesman_code', 90733);
                });
            });

            describe('updateSocialPerformanceRecord', () => {
                it('should simulate updating a social performance record', async () => {
                    const mockUpdates = {actual_value: 5};
                    const mockData = {
                        _id: 'mockid12345',
                        goal_description: 'Openness to Employee',
                        target_value: 3,
                        actual_value: 2,
                        year: 2023,
                        salesman_code: 90734
                    };

                    stub = sinon.stub(socialPerformanceRecordModel, 'findByIdAndUpdate').returns(Promise.resolve({...mockData, ...mockUpdates}));

                    const updatedRecord = await db.updateSocialPerformanceRecord(mockData._id, mockUpdates);
                    expect(updatedRecord).to.have.property('actual_value', 5);
                });
            });
        });

        describe('SalePerformance', () => {
            describe("getAllSalePerformance", () => {
                it("should fetch mocked all sale performance records", async () => {
                    const mockData = [
                        {salesOrderName: "Order1", activeYear: 2023, salesmanGovId: 12345},
                        {salesOrderName: "Order2", activeYear: 2023, salesmanGovId: 12346},
                    ];

                    sinon.stub(salePerformanceRecordModel, "find").returns(Promise.resolve(mockData));

                    const data = await db.getAllSalePerformance();
                    expect(data).to.be.an("array");
                    expect(data.length).to.equal(2);
                    expect(data[0].salesOrderName).to.equal("Order1");
                });
            });

            describe("getAllSalePerformanceCountForCurrentYear", () => {
                it("should count mocked sale performance records for the current year", async () => {
                    sinon.stub(salePerformanceRecordModel, "countDocuments").returns(Promise.resolve(5));

                    const count = await db.getAllSalePerformanceCountForCurrentYear();
                    expect(count).to.equal(5);
                });
            });

            describe("getAllSalePerformancesBySalesmanCode", () => {
                it("should fetch mocked sale performance records by salesman code", async () => {
                    const mockData = [
                        {salesOrderName: "Order1", activeYear: 2023, salesmanGovId: 12345},
                    ];

                    sinon.stub(salePerformanceRecordModel, "find").returns(Promise.resolve(mockData));

                    const data = await db.getAllSalePerformancesBySalesmanCode(12345);
                    expect(data).to.be.an("array");
                    expect(data.length).to.equal(1);
                    expect(data[0].salesmanGovId).to.equal(12345);
                });
            });
        });
    });
});