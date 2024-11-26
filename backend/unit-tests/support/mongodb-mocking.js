const mongoMock = require('mongo-mock');
const MongoClient = mongoMock.MongoClient;

const url = 'mongodb://localhost:27017/db';

const ignoredCollections = ['system.indexes']; //collections, which are ignored in reset-operations

exports.initMockedMongoDB = async function(){
    const con = await MongoClient.connect(url);
    db = con.db();
    return db;
}

exports.resetMockedMongoDB = async function(db){
    const collectionNames = (await db.listCollections().toArray()).map(collection => collection.name).filter(collection => !ignoredCollections.includes(collection));
    collectionNames.forEach(collectionName => {
        db.collection(collectionName).toJSON().documents.length = 0;
    });
}

exports.closeMockedMongoDB = async function(db){
    await exports.resetMockedMongoDB(db);
    await db.close();
}