// controller for mqtt
const {MQTT_Task, MQTT_Msg} = require("../models/mqtt.models.js");

exports.addJobToDB = (req, res) => {

  if(!req.body){
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const newFactoryJob = new MQTT_Task({
    jobID: req.body.jobID,
    orderID: req.body.orderID,
    disk_color: req.body.disk_color,
    jobStatus: req.body.jobStatus
  });

  MQTT_Task.addJobToDB(newFactoryJob, (err, data) => {
      if(err) {
          res.status(500).send({
              message:
                err.message || "Some error occured while creating the job."
          });
      }
      else res.send(data);
  });
};

exports.sendNewJob = (req, res) => {

  if(!req.body){
      res.status(400).send({
        message: "Content can not be empty!"
      });
  }

  const newFactoryJob = new MQTT_Msg({
    msg_type: req.body.msg_type,
    payload: {
        job_id: req.body.payload.jobID,
        orderID: req.body.payload.orderID,
        color: req.body.payload.color,
        cook_time: req.body.payload.cook_time,
        slice: req.body.payload.slice, 
    }
  });

  console.log(newFactoryJob);

  MQTT_Msg.sendNewJob(newFactoryJob, (err, data) => {
    res.send(data);
  });

}

exports.cancelByJobId = (req, res) => {
  MQTT_Task.cancelByJobId(req.params.dataRange, (err, data) => {
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
  MQTT_Task.cancelByOrderId((err, data) => {
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
