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

module.exports = { connect, searchEmployeePerName }
