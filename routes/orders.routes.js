
const orders = require("../controllers/orders.controller.js");
var express = require('express');

var router = express.Router();

// Retrieve a single FactoryORder with id
router.get("/tracking/:id", orders.findById);

// Get order quantities for selected length of time
router.get('/orderQuantities/:dataRange', orders.orderQuantities);

// Get Max order ID
router.get("/getMaxOrderID", orders.getMaxOrderID);

// get Max transaction ID
router.get('/getMaxTransactionID', orders.getMaxTransactionID);

// get Max Job ID
router.get('/getMaxJobID', orders.getMaxJobID);

//Query for creating an order
router.post('/ordering', orders.createOrder);

module.exports = router