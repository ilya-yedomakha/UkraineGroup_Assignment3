const axios = require('axios');
const qs = require('querystring');

const baseUrl = 'http://localhost:8888/symfony/web/index.php';

let accessToken = null;

async function  connect() {
    const body = qs.stringify({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'password',
        username: 'demouser',
        password: '*Safb02da42Demo$'
    });

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    const res = await axios.post('http://localhost:8888/symfony/web/index.php/oauth/issueToken?scope=admin', body, config);

    if (res.data.error) {
        throw Error(res.data.error);
    }
    accessToken = res.data['access_token'];
    console.log("Token received: " + accessToken);
    // setTimeout(connect, (res.data['expires_in'] * 1000) - 5000); // -5000ms to ensure to always have a valid token
}



/**
 * @param queryconfig Object keys correspond to https://orangehrm.github.io/orangehrm-api-doc/#api-Employee-SearchEmployee
 */
async function searchEmployeePerName(queryconfig) {
    const config2 = {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };
    const res2 = await axios.get(`${baseUrl}/api/v1/employee/search?${qs.stringify(queryconfig)}`, config2);
    return res2.data.data;
}

async function searchSingleEmployee(id) {
    const config2 = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        }
    };
    const res2 = await axios.get(`${baseUrl}/api/v1/employee/${id}`, config2);
    return res2.data.data;
}

async function updateBonusPayment(hrmId, amount, theYear) {
    const body = qs.stringify({
        value: amount,
        year: theYear
    });
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    const res = await axios.post(`${baseUrl}/api/v1/employee/${hrmId}/bonussalary`, body, config)
        .then(() => console.log('Successfull!') )
        .catch( () => console.log('Failed!')  );
}

async function roundtripForAlda( amount, year ) {
    // Get the token for follow-up requests
    await connect();

    // first look for a user with last name "Alda"
    let data = await searchEmployeePerName( {name:'Alda'} );

    // An array with objects is received. Well, with one object, hopefully ;-! We get this one at index '0'
    let employee = data[0];

    // console.log( data );
    console.log('The employe with name: ' + employee['fullName'] + " has the following id: " + employee['employeeId']);

    // Update the amount
    console.log('Updating the bonus of ' + amount + ' EUR for year ' + year );
    await updateBonusPayment(  employee['employeeId'] , amount , year )
}

async function roundtripWithIDofUser() {
    // Get the token for follow-up requests
    await connect();

    // first look for a user with id = 3;
    // we directly get back a single object, so no navigation / indexing on an array is necessary
    let employee = await  searchSingleEmployee(3);

    // console.log( data );
    console.log('The employe with name: ' + employee['fullName'] + " has the following id: " + employee['employeeId']);

    // Update the amount
    // console.log('Updating the bonus of ' + amount + ' EUR for year ' + amount )
    await updateBonusPayment(  employee['employeeId'] , 43333 , 2035 )
}


//roundtripForAlda( 23, 2025 );
// roundtripWithIDofUser();

module.exports = { connect, searchEmployeePerName }
