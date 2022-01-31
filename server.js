var bodyParser = require('body-parser');
var cors = require("cors");
var connection = require("./models/db.js");
var fs = require("fs");
var https = require("https")

var express = require('express')
var app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

var orderID = 1;

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Upgrade-Insecure-Requests");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "OnlyFactories BD Port!" });
});

//Query Start for finding an Order by orderID. Sent 
//from localhost:3000/tracking to localhost:3306/tracking
app.get('/api/tracking/:id', (req, res) => {
  const orderID = req.params.id;

  if(orderID != null){
    connection.query(`SELECT * from FactoryOrders WHERE orderID = ${orderID}`, function(err,results,fields){
      if(err) throw err;

      console.log(results);
      res.json(results);
      return;
    });
  }
})
//Query END

//Query Start for creating an order. Sent from 
//localhost:3000/ordering to localhost:3306/ordering
app.post('/api/ordering', (req, res) => {
  //var{orderID} = 2
  var{orderID, fullName, email, quantityRED, quantityBLUE, quantityWHITE, orderStatus, transactionID, created_at, updated_at} = req.body;
  /*var{email} = req.body.Email;
  var{quantityRED} = req.body.quantityRED;
  var{quantityBLUE} = req.body.quantityBLUE;
  var{quantityWHITE} = req.body.quantityWHITE;
  var{orderStatus} = "Created"
  var{transactionID} = 222222;
  var{created_at} = new Date().getTime();
  var{updated_at} = new Date().getTime();*/

  var records = [[req.body.orderID, req.body.fullName, req.body.email, req.body.orderStatus, req.body.transactionID, req.body.quantityRED, req.body.quantityBLUE, req.body.quantityWHITE, req.body.created_at, req.body.updated_at]];
  if(records[0][0]!=null){
    connection.query("INSERT INTO FactoryOrders (orderID, fullName, email, orderStatus, transactionID, quantityRED, quantityBLUE, quantityWHITE, created_at, updated_at) VALUES ?", [records], function(err,res,fields){
      if(err) throw err;

      console.log(res);
    });
  }
  res.json('Order received');
  res.json(records);
})
//Query END

require("../NodeJS/routes/orders.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3306;
https.createServer({
	key: fs.readFileSync("/etc/letsencrypt/live/onlyfactories.duckdns.org/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/onlyfactories.duckdns.org/cert.pem"),
	},
	app).listen(PORT, function(){
		console.log("Running on port 3306");
});
