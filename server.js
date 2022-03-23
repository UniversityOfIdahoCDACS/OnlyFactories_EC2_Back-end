var bodyParser = require('body-parser');
var cors = require("cors");
var connection = require("./models/db.js");
var fs = require("fs");
var https = require("https")

var express = require('express')
var app = express().use('*', cors());

var factoryRouter = require("./routes/orders.routes.js");
var mqttRouter = require("./routes/mqtt.routes.js");


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

var allowCrossDomain = function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
	res.header("Access-control-Headers", "Content-Type, Origin, X-Requested-With, Accept, Authorization, Upgrade-Insecure-Requests");
	next();
}

app.use(allowCrossDomain);

// Routes for order API and MQTT API
app.use('/api', factoryRouter);
app.use('/mqtt', mqttRouter);
// Route to grab static files
app.use('/images', express.static('images'));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "OnlyFactories BD Port!" });
});


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//     TO RUN EXPRESS SERVER LOCALLY, COMMENT OUT CODE BELOW AND UNCOMMENT CODE AT BOTTOM
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


// set port, listen for requests
const PORT = process.env.PORT || 3306;
https.createServer({
	key: fs.readFileSync("/etc/letsencrypt/live/onlyfactories.duckdns.org/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/onlyfactories.duckdns.org/cert.pem"),
	},
	app).listen(PORT,  function(){
		console.log("Running on port 3306");
});


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//     TO RUN EXPRESS SERVER LOCALLY, UNCOMMENT CODE BELOW AND COMMENT OUT LISTEN ABOVE
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

/*
// set port, listen for requests
const PORT = 3306;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
*/

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//     MAKE SURE TO CHANGE BACK COMMENTS TO LIVE SERVER BEFORE PUSHING
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
