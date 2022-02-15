const sql = require("./db.js");

//Constructor
const FactoryOrder = function(factoryorder) {
    this.orderID = factoryorder.orderID;
    this.fullName = factoryorder.fullName;
    this.email = factoryorder.email;
    this.orderStatus = factoryorder.orderStatus;
    this.transactionID = factoryorder.transactionID;
    this.quantityRED = factoryorder.quantityRED;
    this.quantityBLUE = factoryorder.quantityBLUE;
    this.quantityWHITE = factoryorder.quantityWHITE;
    this.created_at = factoryorder.created_at;
    this.updated_at = factoryorder.updated_at;
};

//Constructor for FactoryTransaction
const FactoryTransaction = function(factorytransaction) {
    this.orderID = factorytransaction.orderID;
    this.transactionID = factorytransaction.transactionID;
    this.ccNumber = factorytransaction.ccNumber;
    this.ccExp = factorytransaction.ccExp;
    this.orderTotal = factorytransaction.orderTotal;
};

FactoryOrder.findById = (id, result) => {
    sql.query(`SELECT * FROM FactoryOrders WHERE orderID = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length){
            console.log("found Order: ", res[0]);
            result(null, res[0]);
            return;
        }

        //not found Order with the id
        result({ kind: "not_found"}, null);

    });
};

FactoryOrder.orderQuantities = (dataRange, result) => {
    let currentDate = new Date();
    let endDate = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-'
                    + currentDate.getDate() + ' ' + currentDate.getHours() + ':'
                    + currentDate.getMinutes() + ':' + currentDate.getSeconds();

    currentDate.setDate(currentDate.getDate() - dataRange);

    let beginDate = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-'
                    + currentDate.getDate() + ' ' + currentDate.getHours() + ':'
                    + currentDate.getMinutes() + ':' + currentDate.getSeconds();

    sql.query(`SELECT SUM(quantityRED) AS numRed, SUM(quantityBLUE) AS numBlue, SUM(quantityWHITE) AS numWhite FROM FactoryOrders WHERE created_at BETWEEN \"${beginDate}\" AND \"${endDate}\"`, (err,res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log("Found order quantities");
            result(null, res);
            return;
        }

        result({ kind: "order quantities not found"}, null);
    });
};

FactoryOrder.getMaxOrderID = (result) => {
    sql.query(`SELECT MAX(orderID) as orderID from FactoryOrders`, (err, res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log("Found Max OrderID: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "max OrderID not found"}, null);
    });
};

FactoryOrder.getMaxTransactionID = (result) => {
    sql.query(`SELECT MAX(transactionID) as transactionID from FactoryOrders`, (err,res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log("Found Max TransactionID: ", res[0]);
            result(null, res[0]);
            return;
        }
        
        //no orders were found
        result({ kind: "max TransactionID not found"}, null);
    });
};

FactoryOrder.createOrder = (newFactoryOrder, result) =>{
    sql.query("INSERT INTO FactoryOrders SET ?", newFactoryOrder, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Created order: ", {id: res.orderID, ...newFactoryOrder});
        result(null, { id: res.orderID, ...newFactoryOrder });

    });
};

FactoryTransaction.createTransaction = (newFactoryTransaction, result) =>{
    sql.query("INSERT INTO Transactions SET ?", newFactoryTransaction, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Created transaction: ", {id: res.orderID, ...newFactoryTransaction});
        result(null, { id: res.orderID, ...newFactoryTransaction });

    });
};

module.exports = {FactoryOrder, FactoryTransaction};