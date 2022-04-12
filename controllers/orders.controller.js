const {FactoryOrder, FactoryTransaction, LogIn, ItemPrice} = require("../models/orders.model.js");

exports.findById = (req, res) => {
  FactoryOrder.findById(req.params.id, (err, data) => {
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

exports.orderQuantities = (req, res) => {
  FactoryOrder.orderQuantities(req.params.dataRange, (err, data) => {
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

exports.getDaysQ = (req, res) => {
  FactoryOrder.getDaysQ(req.params.day, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not orders found in Date Range.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving orders in date range"
        });
      }
    } else res.send(data);
  });
}

exports.checkLogin = (req, res) => {
  LogIn.checkLogin(req.params.data, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Failed Login`
        });
      } else {
        res.status(500).send({
          message: "Falied Login " + req.params.data
        });
      }
    } else res.send(data);
  });
}

exports.checkPrice = (req, res) => {
  ItemPrice.checkPrice((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Failed Price Check`
        });
      } else {
        res.status(500).send({
          message: "Failed Price Check " + req.params.data
        });
      }
    } else res.send(data);
  });
}

exports.getMaxOrderID = (req, res) => {
  FactoryOrder.getMaxOrderID((err, data) => {
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

exports.getMaxTransactionID = (req, res) => {
  FactoryOrder.getMaxTransactionID((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Orders Found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Max Transaction ID"
        });
      }
    } else res.send(data);
  });
}

exports.getMaxJobID = (req, res) => {
  FactoryOrder.getMaxJobID((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Orders Found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Max Job ID"
        });
      }
    } else res.send(data);
  });
}

exports.getFactoryOrderID = (req, res) => {
  FactoryOrder.getFactoryOrderID(req.params.jobID, (err, data) => {
    if(err){
      if(err.kind === "not_found"){
        res.status(404).send({
          message: `No order found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving current OrderID"
        });
      }
    } else res.send(data);
  });
}

exports.getFactoryJobID = (req,res) => {
  FactoryOrder.getFactoryJobID((err, data) => {
    if(err){
      if(err.kind === "not_found"){
        res.status(404).send({
          message: `No job found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving current jobID"
        });
      }
    } else res.send(data);
  });
}

exports.getPrices = (req, res) => {
  FactoryOrder.getPrices((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Orders Found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Max Transaction ID"
        });
      }
    } else res.send(data);
  });
}

// Create and Save a new FactoryOrder
exports.createOrder = (req, res) => {
  // Validate request
  if (!req.body) {
      res.status(400).send({
          message: "Content can not be empty!"
      });
  }

  //Create a FactoryOrder
  const factoryorder = new FactoryOrder({
      orderID: req.body.orderID,
      fullName: req.body.fullName,
      email: req.body.email,
      orderStatus: req.body.orderStatus,
      transactionID: req.body.transactionID, 
      quantityRED: req.body.quantityRED,
      quantityBLUE: req.body.quantityBLUE,
      quantityWHITE: req.body.quantityWHITE,
      created_at : req.body.created_at,
      updated_at : req.body.updated_at
  });

  //Save FactoryOrder in database
  FactoryOrder.createOrder(factoryorder, (err, data) => {
      if(err) {
          res.status(500).send({
              message:
                err.message || "Some error occured while creating the order."
          });
      }
      else res.send(data);
  });

}

// Create and Save a new FactoryTransaction
exports.createTransaction = (req, res) => {
  // Validate request
  if (!req.body) {
      res.status(400).send({
          message: "Content can not be empty!"
      });
  }

  //Create a FactoryOrder
  const factorytransaction = new FactoryTransaction({
      orderID: req.body.orderID,
      transactionID: req.body.transactionID, 
      ccNumber: req.body.ccNumber,
      ccExp: req.body.ccExp,
      orderTotal: req.body.orderTotal
  });

  //console.log(factorytransaction);

  //Save FactoryOrder in database
  FactoryTransaction.createTransaction(factorytransaction, (err, data) => {
      if(err) {
          res.status(500).send({
              message:
                err.message || "Some error occured while creating the tranaction."
          });
      }
      else res.send(data);
  });

}

// get last webcam frame
exports.getWebcamFrame = (req, res) => {
  FactoryOrder.getWebcamFrame((err, data) => {
    if(err){
      if(err.kind === "not_found"){
        res.status(404).send({
          message: "No frame found"
        });
      } else{
        res.status(500).send({
          message: "Error retrieving frame"
        });
      }
    } else {
      console.log("Data.image_data: ", data.image_data);

      //const imgData = Buffer(data.image_data, 'base64');
      res.type('jpeg').send(data.image_data);
    }
  });
}