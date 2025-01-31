const peopleDemoService = require("../services/people-demo-service");

exports.getPeople = function (req, res){

    peopleDemoService.getPeople().then(people => {
        res.status(200).send({apiStatus: true, message: 'People are received', data: people});
    }).catch(_=>{
        res.status(500).send({apiStatus: false, message: 'Server error, try later'});
    })
}