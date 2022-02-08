// controller for mqtt

const MQTT_Task = require("../models/mqtt.model.js");

exports.addJobToDB = (req, res) => {
    MQTT.addJobToDB(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found FactoryOrder with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving FactoryOrder with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  }

exports.sendNewJob = (req, res) => {
  MQTT.sendNewJob(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found FactoryOrder with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving FactoryOrder with id " + req.params.id
        });
      }
    } else res.send(data);
  });
}

exports.cancelByJobId = (req, res) => {
    MQTT.cancelByJobId(req.params.dataRange, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not orders found in Date Range.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving orders in date range " + req.params.dataRange
        });
      }
    } else res.send(data);
  });
}

exports.cancelByOrderId = (req, res) => {
    MQTT.cancelByOrderId((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Max order ID not found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Max order id."
        });
      }
    } else res.send(data);
  });
}


// Create and Save a new FactoryOrder
exports.updateInventory = (req, res) => {
  // Validate request
  if (!req.body) {
      res.status(400).send({
          message: "Content can not be empty!"
      });
  }

  //Create a FactoryOrder
  const newInventory = new MQTT_Task({
      
      quantityRED: req.body.quantityRED,
      quantityBLUE: req.body.quantityBLUE,
      quantityWHITE: req.body.quantityWHITE,

  });

  //Save FactoryOrder in database
  MQTT.updateInventory(newInventory, (err, data) => {
      if(err) {
          res.status(500).send({
              message:
                err.message || "Some error occured while creating the order."
          });
      }
      else res.send(data);
  });

};