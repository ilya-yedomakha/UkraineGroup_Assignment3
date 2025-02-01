const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const options = {
    openapi: "OpenAPI 3",
    language: "en-US",
    disableLogs: false,
    autoHeaders: false,
    autoQuery: false,
    autoBody: false,
};
const generateSwagger = require("swagger-autogen")();

const swaggerDocument = {
    info: {
        version: "1.0.0",
        title: "SmartHoover United",
        description: "API for Managing SmartHoover's salesmen bonus calculation and their social performance",
        contact: {
            name: "Ukraine Group",
            url: "https://github.com/ilya-yedomakha/UkraineGroup_Assignment3.git"
        },
    },
    host: "localhost:8080",
    basePath: "/",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Authentication",
            description: "User-related requests"
        },
        {
            name: "Salesmen",
            description: "Operations with salesmen"
        },
        {
            name: "Social Performance",
            description: "Operations with salesmen' social performance"
        },
        {
            name: "Sales Performance",
            description: "Operations with salesmen' sales performance"
        },
        {
            name: "Reports",
            description: "Operations with reports on salesmen' bonus salary"
        },
        {
            name: "Rejection",
            description: "Operations with rejection message on salesmen' bonus salary"
        }
    ],
    securityDefinitions: {},
    definitions: {
        apiResponse: {
            code: 200,
            message: "Success",
        },
        "errorResponse.400": {
            code: 400,
            message:
                "The request was malformed or invalid. Please check the request parameters.",
        },
        "errorResponse.401": {
            code: 401,
            message: "Authentication failed or user lacks proper authorization.",
        },
        "errorResponse.403": {
            code: 403,
            message: "You do not have permission to access this resource.",
        },
        "errorResponse.404": {
            code: "404",
            message: "The requested resource could not be found on the server.",
        },
        "errorResponse.500": {
            code: 500,
            message:
                "An unexpected error occurred on the server. Please try again later.",
        },
        userSchema: {
            username: 'admin',
            password: '5$c3inw%'
        },
        userCreationSchema: {
            username: 'username',
            firstname: 'firstname',
            lastname: 'lastname',
            email: 'email',
            password: 'password',
            role: 2,
            code: 12345
        },
        socialPerformanceRecordSchema: {
            goal_description: "Attitude toward Client",
            target_value: 5,
            actual_value: 1,
            year: 2021
        },
        reportSchema: {
            ordersBonuses: [],
            socialBonuses: [],
            remarks: "remark"
        },
        rejectionSchema: {
            salesman_code: 90731,
            report_id: "678516a752714ecb1941ce3e",
            year: 2025,
            message: "You made a mistake in the calculations"
        },
        reverseArray: {
            ids: ["678010157d630c79c9312c7d",
                "678010167d630c79c9312c88"
            ]
        },
        confirmationPairCEO: {
            pairs: [
                {
                    _id: "678010157d630c79c9312c7d",
                    confirm: true
                },
                {
                    _id: "678010167d630c79c9312c88",
                    confirm: false
                }
            ]
        },
        remarkSendEmailSchema:{
            email:"testemail@gmail.com",
            message:"You are really great worker"
        },
        userPasswordChangeSchema:{
            oldPassword:"oldPassword",
            newPassword:"newPassword"
        }

    }
};
const swaggerFile = "./docs/swagger.json";
const apiRouteFile = ["./app.js"];
generateSwagger(swaggerFile, apiRouteFile, swaggerDocument).then(({success}) => {
    console.log(`Generated: ${success}`)
});