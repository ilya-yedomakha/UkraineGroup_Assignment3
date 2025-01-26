const axios = require('axios');

const baseUrl = 'http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard';

const credentials = {
    username: 'guest',
    password: 'guest',
};

const config = {
    headers: {
        'Accept': 'application/json'
    },
    auth: credentials,
};

async function connect() {
    const config = {
        headers: {
            'Accept': 'application/json'
        },
        auth: credentials,
    };
    return await axios.get('http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder', config);
}

async function getAllAccounts() {
    const config = {
        auth: credentials
    };
    const accounts = await axios.get('http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account', config);
    return accounts;
}

async function getSalesManByGovernmentID( id ) {
    const accounts = await getAllAccounts();

    const contacts = accounts.data.objects.filter(contact => contact['@type'] === 'org.opencrx.kernel.account1.Contact')

    for (var i = 0; i < contacts.length; i++){
        const govID = contacts[i]["governmentId"];

        if (govID === id ){
            console.log("Name: " + contacts[i]["fullName"] );

            const salesMenArray = contacts[i]['@href'].split("/");
            const salesMan = salesMenArray[ salesMenArray.length - 1 ];
            console.log( 'ID of SalesMan (extracted): ' + salesMan );

            return contacts[i];
        }
    }
}

module.exports = { connect, getSalesManByGovernmentID }
