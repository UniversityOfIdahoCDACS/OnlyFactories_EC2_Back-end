
const orders = require("../controllers/orders.controller.js");
var express = require('express');

var router = express.Router();

// Retrieve a single FactoryORder with id
router.get("/tracking/:id", orders.findById);

// Get order quantities for selected length of time
router.get('/orderQuantities/:dataRange', orders.orderQuantities);

// Check Username and Password
router.get('/checkLogin/:data', orders.checkLogin);

// Check Prices
router.get('/checkPrice', orders.checkPrice);

// Check Qunatity per day
router.get('/getDaysQ/:day', orders.getDaysQ);

// Get Max order ID
router.get("/getMaxOrderID", orders.getMaxOrderID);

// get Max transaction ID
router.get('/getMaxTransactionID', orders.getMaxTransactionID);

// get Max Job ID
router.get('/getMaxJobID', orders.getMaxJobID);

// get the orderID the factory is processing
router.get('/getFactoryOrderID/:jobID', orders.getFactoryOrderID);

// get the jobID the factory is processing
router.get('/getFactoryJobID', orders.getFactoryJobID);

//Get item pricing per unit
router.get("/itemPrices/", orders.getPrices);

//Query for creating an order
router.post('/ordering', orders.createOrder);

//Query for creating an transaction for an order
router.post('/transactions', orders.createTransaction);

// get webcam frame
router.get('/getWebcamFrame', orders.getWebcamFrame);

module.exports = router