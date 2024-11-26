const environment = {
    production: true,
    port: 8080,
    defaultAdminPassword: 'c3uz#3zd',
    db:{
        host: 'iar-mongo.inf.h-brs.de',
        port: 27017,
        username: 'iarframework',
        password: 'iarframework!',
        authSource: 'iarframework',
        name: 'iarframework'
    },
    corsOrigins: [
        'http://iar-frontend.inf.h-brs.de'
    ]
};

exports.default = environment;