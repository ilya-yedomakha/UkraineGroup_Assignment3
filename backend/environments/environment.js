const environment = {
    production: false,
    port: 8080,
    defaultAdminPassword: '5$c3inw%',
    defaultAdminCode: '11111',
    db:{
        host: '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        authSource: 'admin',
        name: 'intArch'
    },
    corsOrigins: [
        'http://localhost:4200'
    ],
    orangeHRMUsername: 'demouser',
    passwordHRM: '*Safb02da42Demo$',
    openCRXUsername: 'guest',
    passwordCRX: 'guest'

};

exports.default = environment;
