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

    sql.query(`SELECT sum(CASE WHEN quantityRED > 0 THEN quantityRED ELSE 0 END) AS numRed, sum(CASE WHEN quantityBLUE > 0 THEN quantityBLUE ELSE 0 END) AS numBlue, sum(CASE WHEN quantityWHITE > 0 THEN quantityWHITE ELSE 0 END) AS numWhite, sum(CASE WHEN orderStatus = "Created" THEN 1 ELSE 0 END) AS inQue,sum(CASE WHEN orderStatus = "Completed" THEN 1 ELSE 0 END) AS completed FROM FactoryOrders WHERE created_at BETWEEN \"${beginDate}\" AND \"${endDate}\"`, (err,res) => {
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

        console.log("Created order: ", {id: res.insertId, ...newFactoryOrder});
        result(null, { id: res.insertId, ...newFactoryOrder });

    });
};

module.exports = FactoryOrder;