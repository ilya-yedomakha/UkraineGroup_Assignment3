const peopleDemoService = require("../services/people-demo-service");

exports.getPeople = function (req, res){

    peopleDemoService.getPeople().then(people => {
        res.send(people);
    }).catch(_=>{
        res.status(500).send();
    })
}