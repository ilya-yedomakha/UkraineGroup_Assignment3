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
const swaggerUIPath= require("swagger-ui-express");
const swaggerjsonFilePath = require("../docs/swagger.json");

const Role = require("./models/Role")

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

const salesmanRoutes = require("./routes/salesman-routes")
const socialPerformanceRecordsRoutes = require("./routes/social-performance-records-routes")
const salePerformanceRecordsRoutes = require("./routes/sale-performance-records-routes")
const apiReportsRoutes = require("./routes/report-routes")
const apiRejectionMessagesRoutes = require("./routes/rejection-routes")

const apiRouter = require('./routes/api-routes');//get api-router from routes/api
const mongoose = require("mongoose");
app.use("/api/salesman", salesmanRoutes)
app.use("/api/social_performance_record", socialPerformanceRecordsRoutes)
app.use("/api/sale_performance_record", salePerformanceRecordsRoutes)
app.use("/api/report", apiReportsRoutes)
app.use("/api/rejection", apiRejectionMessagesRoutes)
app.use('/api', apiRouter); //mount api-router at path "/api"
app.use("/api-docs", swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));
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
            // swaggerDocs(app, environment.port);
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
        const adminCode = environment.defaultAdminCode;
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, Role.CEO, adminCode));

        console.log('created admin user with password: '+adminPassword);
    }
}