const {FactoryOrder, FactoryTransaction, LogIn} = require("../models/orders.model.js");

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

  console.log(factorytransaction);

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