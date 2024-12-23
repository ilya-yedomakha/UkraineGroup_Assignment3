/*
    This file acts as the entrypoint for node.js
 */

const express = require('express');
const cookieSession = require('cookie-session');

const multer = require('multer');
const upload = multer();
const app = express();
const crypto = require('crypto');
const cors = require('cors');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let environment;
if(process.env.NODE_ENV === 'development'){
    environment = require('../environments/environment.js').default;
}else{
    environment = require('../environments/environment.prod.js').default;
}

app.set('environment', environment);

app.use(express.json()); //adds support for json encoded bodies
app.use(express.urlencoded({extended: true})); //adds support url encoded bodies
app.use(upload.array()); //adds support multipart/form-data bodies

app.use(cookieSession({
    secret: crypto.randomBytes(32).toString('hex'),
    sameSite: false,
    secure: false,
    httpOnly: false
}));

app.use(cors({
    origin: environment.corsOrigins,
    credentials: true
}));

const salesmanRoutes = require("./routes/salesman.routes")
const socialPerformanceRecordsRoutes = require("./routes/social-performance-records-routes")
const salePerformanceRecordsRoutes = require("./routes/sale_performance_records.routes")


const apiRouter = require('./routes/api-routes');//get api-router from routes/api
const mongoose = require("mongoose");
app.use("/api/salesman", salesmanRoutes)
app.use("/api/social_performance_record", socialPerformanceRecordsRoutes)
app.use("/api/sale_performance_record", salePerformanceRecordsRoutes)
app.use('/api', apiRouter); //mount api-router at path "/api"
// !!!! attention all middlewares, mounted after the router wont be called for any requests

//preparing database credentials for establishing the connection:
let db_credentials = '';
if(environment.db.username){
    db_credentials = environment.db.username+':'+environment.db.password+'@';
}


mongoose
    .connect('mongodb://' + db_credentials + environment.db.host + ':' + environment.db.port + '/' + environment.db.name + '?authSource=' + environment.db.authSource)
    .then(async () => {
        const db = mongoose.connection; // Get the connection
        await initDb(db); // Run initialization function
        app.set('db', db); // Register database in the express app

        app.listen(environment.port, () => {
            // Start webserver after database connection is established
            console.log('Webserver started.');
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// MongoClient.connect('mongodb://' + db_credentials + environment.db.host + ':' + environment.db.port + '/?authSource='+environment.db.authSource).then(async dbo =>{ //connect to MongoDb
//
//     const db = dbo.db(environment.db.name);
//     await initDb(db); //run initialization function
//     app.set('db',db); //register database in the express app
//
//     app.listen(environment.port, () => { //start webserver, after database-connection was established
//         console.log('Webserver started.');
//     });
// });


async function initDb(db){
    if(await db.collection('users').count() < 1){ //if no user exists create admin user
        const userService = require('./services/user-service');
        const User = require("./models/User");

        const adminPassword = environment.defaultAdminPassword;
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, true));

        console.log('created admin user with password: '+adminPassword);
    }
}