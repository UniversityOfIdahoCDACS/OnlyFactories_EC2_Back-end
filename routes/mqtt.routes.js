// routes for mqtt 

const mqtt = require("../controllers/mqtt.controller.js");
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "OnlyFactories MQTT API!" });
  });

// add job to DB
router.post('/addJobToDB', mqtt.addJobToDB);

// send single job to factory
router.post('/sendNewJob', mqtt.sendNewJob);

// Cancel job by Job ID
router.get('/cancelByJobId', mqtt.cancelByJobId);

// Cancel job by Order ID
router.get('/cancelByOrderId', mqtt.cancelByOrderId);

module.exports = router