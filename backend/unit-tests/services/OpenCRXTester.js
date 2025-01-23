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
    //simple request to check if the service is online
    return await axios.get('http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder', config);
}

async function getAllAccounts() {
    // Send a request to the server and fetch all accounts
    const config = {
        auth: credentials
    };
    const accounts = await axios.get('http://localhost:8887/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account', config);
    return accounts;
}

async function getSalesManByGovernmentID( id ) {
    // Send a request to the server and fetch all accounts
    const accounts = await getAllAccounts();

    // Iterate the array of all accounts
    // - accounts.data.objects fetches the internal array that contains the contacts
    // Put an additional filter on it in order to receive only Contacts (i.e. persons!)
    const contacts = accounts.data.objects.filter(contact => contact['@type'] === 'org.opencrx.kernel.account1.Contact')

    // Now, pick each customer objects and print out everything
    for (var i = 0; i < contacts.length; i++){
        const govID = contacts[i]["governmentId"];

        if (govID === id ){
            console.log("Name: " + contacts[i]["fullName"] );

            // Splitting for getting SalesMan-ID:
            const salesMenArray = contacts[i]['@href'].split("/");
            const salesMan = salesMenArray[ salesMenArray.length - 1 ];
            console.log( 'ID of SalesMan (extracted): ' + salesMan );

            return contacts[i];
        }
    }
}

async function getCustomer( id ) {
    // Send a request to the server
    const contact = await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${id}`, config);

    // Now, pick each customer objects and print out everything
    console.log( contact.data );
    const obj = contact.data;
    console.log( "Das Rating: " + obj["accountRating"] );
    return contact;
}

async function getAllCustomersWithProjectionAndFiltering() {
    // Send a request to the server and fetch all accounts
    const contacts =
        await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`, config);

    // Iterate the array of all accounts
    // - contacts.data.objects fetches the internal array that contains the customers
    // Put an additional filter on it in order to receive only LegalEntities (i.e. customers!)
    const customers = contacts.data.objects.filter(contact => contact['@type'] === 'org.opencrx.kernel.account1.LegalEntity');

    for (var i = 0; i < customers.length; i++){
        var obj = customers[i];

        // Print out the name and the rating
        console.log( ' Name of company: ' + obj['name'] +'; Rating: ' + obj['accountRating'] );
    }
    // well, just return the filtered objects for further handling
    return customers;
}

async function getAllCustomersWithProjectionAndFilteringAPI() {
    // Send a request to the server and fetch all customers by using the Query API of OpenCRX:
    // (https://github.com/opencrx/opencrx-documentation/blob/master/Sdk/Rest.md)
    const queryType = "org:opencrx:kernel:account1:LegalEntity";
    const result =
        await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account?queryType=` + queryType, config);

    // Fetch the internal array of objects representing the customers (no further filtering necessary!)
    const customers = result.data.objects;
    for (var i = 0; i < customers.length; i++){
        var obj = customers[i];

        // Print out the name and the rating
        console.log( ' Name of company: ' + obj['name'] +'; Rating: ' + obj['accountRating'] );
    }
    // well, just return the filtered objects for further handling
    return customers;
}

async function getSalesOrder( id ) {
    const order = await axios.get(`${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${id}`, config);
    console.log("Fetchted the order: " + order.data);
    const obj = order.data;
    console.log("Das Bezugsjahr für Auswertung: " + obj["createdAt"].substring(0,4) );

    return obj;
}

async function getPositionsOfASalesOrder( orderID  ) {
    const positions = await axios.get(`${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${orderID}/position`, config);
    console.log(positions.data);
    return positions;
}

async function getSinglePosition ( orderID, positionID ) {
    const position = await axios.get(`${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${orderID}/position/${positionID}`, config);
    console.log(position.data);
    const obj = position.data;
    console.log(  "Quantity (Items): " + obj["quantityBackOrdered"] );

    return position;
}

async function getProduct ( productID ) {
    const position = await axios.get(`${baseUrl}/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/${productID}`, config);
    console.log(position.data);
    const obj = position.data;
    console.log("Name des Produkts: " + obj["name"]  );
    return position;
}

/**
 * Get all orders of a salesman (identified with an id from OrangeHRM) for a given year
 * This function is necessary since OpenCRX does not provide a REST endpoint for satisfying this query!
 *
 */
async function getAndPrintAllOrdersOfASalesman( id, year ) {

    // Get the contact (here: the SalesMan) with the given governmentID (=id!). Fetch name and identity (OpenCRX!)
    const contact = await getSalesManByGovernmentID( id );
    const salesMenArray = contact['@href'].split("/");
    const identityOfSalesMan = salesMenArray[ salesMenArray.length - 1 ];
    const name = contact["fullName"];

    console.log("Fetched Salesman with ID: " + identityOfSalesMan + " and with full name: " + name );

    // Send a request to the server to get all orders
    const result =
        await axios.get(`${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`, config);

    // Iterate the array
    // - result.data.objects fetches the internal array that contains the orders
    const orders = result.data.objects;

    // console.log(orders);

    const allRelevantSalesObjects=[];

    for (var i = 0; i < orders.length; i++){
        var obj = orders[i];
        const yearOfOrder = obj["createdAt"].substring(0,4);
        console.log("Year of order: " + yearOfOrder);

        // Splitting for getting SalesMan-ID:
        const salesMenArray = obj['salesRep']['@href'].split("/");
        const salesManID = salesMenArray[ salesMenArray.length - 1 ];

        // Print out the name and the rating
        console.log( ' ID of SalesMan: ' + salesManID );

        // Get SalesOrder and corresponding customer only if ID and year fit!!
        if ( ( salesManID == identityOfSalesMan ) && ( yearOfOrder == year ) ) {
            console.log("In If-Block!");
            // Get the id of given SalesOrder-object:
            const salesOrderArray = obj['@href'].split("/");
            const salesOrderID = salesOrderArray[ salesOrderArray.length - 1 ];

            // Get the current SalesOrder-object
            const salesOrder = getSalesOrder( salesOrderID );

            allRelevantSalesObjects.push(salesOrder);
        }
    }

    console.log("Number of relevant SalesOrder-objects: " + allRelevantSalesObjects.length );

    // well, just return the filtered objects for further handling
    return allRelevantSalesObjects;
}

async function getAllAccountsAndPrint() {
    // Send a request to the server and fetch all accounts
    const accounts =
        await axios.get(`${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`, config);

    // Print out the 'pure' data received
    console.log( accounts );

    // Iterate the array
    // - accounts.data.objects fetches the internal array with the key 'objects' that contains the accounts
    const objects = accounts.data.objects;

    // Print out the array
    // console.log( objects );

    // Now, pick each account objects and print out everything (what a mess of data!)
    for (var i = 0; i < objects.length; i++){
        // console.log( objects[i] );
    }
    // For further processing
    return objects;
}

// Demo in lecture:
const accounts = getAllAccountsAndPrint();
// const customers = getAllCustomersWithProjectionAndFiltering();
// getAllCustomersWithProjectionAndFilteringAPI();

// Further endpoints:
// const orders = getAndPrintAllOrdersOfASalesman(90123, 2019);
// const order = getSalesOrder("9DXSKIH1RCHD5H2MA4T2TYJFL");
// const positions = getPositionsOfASalesOrder("9DXSKIH1RCHD5H2MA4T2TYJFL");
// getSinglePosition( "9DXSKIH1RCHD5H2MA4T2TYJFL" , "9DXSKJMHEPMUHH2MA4T2TYJFL" );
// getProduct("9JMBMVTX2CSMHH2MA4T2TYJFL");
// getCustomer("RC9375R5ALYW9H84KQGL5CLHT");
// getSalesManByGovernmentID(90123);

module.exports = { connect, getSalesManByGovernmentID }
