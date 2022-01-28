// ./src/index.js
//

//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');

//define express app
const app = express();

//definte the SSL creds
var credentials = {
	key: fs.readFileSync('/etc/mosquitto/certs/privkey.pem'),
	cert: fs.readFileSync('/etc/mosquitto/certs/cert.pem')
};

// define an array to work as the DB temporarily
const ads = [
	{title: 'Hello, world!'}
];

// add helmet to enhance API security
app.use(helmet());

// use bodyParser to parse JSON bodies in to JS objects
app.use(bodyParser.json());

// enable CORS for all requests
app.use(cors());

// add morgan to log HTTP requests
app.use(morgan('combined'));

app.get('/', (req, res) => {
	res.send(ads);
});

// start the server
/*
app.listen(3306, () => {
	console.log('Listening on port 3306');
});
*/
http.createServer(app).listen(80, () => {
	console.log('Listening on port 80');
});

https.createServer(credentials, app).listen(443, () => {
	console.log('Listening on port 443');
});
