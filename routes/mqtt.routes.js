// routes for mqtt 

const mqtt = require("../controllers/mqtt.controller.js");
var express = require('express');

var router = express.Router();

// add job to DB
router.get('/addJobToDB', mqtt.addJobToDB);

// send single job to factory
router.get('/sendNewJob', mqtt.sendNewJob);

// Cancel job by Job ID
router.get('/cancelByJobId', mqtt.cancelByJobId);

// Cancel job by Order ID
router.get('/cancelByOrderId', mqtt.cancelByOrderId);

// Update inventory
router.put('/updateInventory', mqtt.updateInventory);

module.exports = router