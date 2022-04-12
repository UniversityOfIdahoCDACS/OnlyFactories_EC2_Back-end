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

//Constructor for LogIn
const LogIn = function(login) {
    this.UserName = login.UserName;
    this.Password = login.Password;
};

//Constructor for Item Price
const ItemPrice = function(itemP) {
    this.disk_color = itemP.disk_color;
    this.cust_price = itemP.cust_price;
    this.prod_cost = itemP.prod_cost;
};

FactoryOrder.findById = (id, result) => {
    sql.query(`SELECT * FROM FactoryOrders WHERE orderID = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length){
            //console.log("found Order: ", res[0]);
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

    sql.query(`SELECT sum(CASE WHEN quantityRED > 0 THEN quantityRED ELSE 0 END) AS numRed, sum(CASE WHEN quantityBLUE > 0 THEN quantityBLUE ELSE 0 END) AS numBlue, sum(CASE WHEN quantityWHITE > 0 THEN quantityWHITE ELSE 0 END) AS numWhite, sum(CASE WHEN orderStatus = "Created" THEN 1 ELSE 0 END) AS inQue, sum(CASE WHEN orderStatus = "Completed" THEN 1 ELSE 0 END) AS completed, count(orderStatus) AS totalOrders FROM FactoryOrders WHERE created_at BETWEEN \"${beginDate}\" AND \"${endDate}\"`, (err,res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            //console.log("Found order quantities");
            result(null, res);
            return;
        }

        result({ kind: "order quantities not found"}, null);
    });
};

FactoryOrder.getDaysQ = (day, result) => {
    let m = day.substring(0, day.indexOf('-'));
    let d = day.substring(day.indexOf('-')+1, day.length);

    let currentDate = new Date();
    currentDate.setMonth(m);
    currentDate.setDate(d);

    let day1 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate()

    currentDate.setDate(currentDate.getDate() - 1);
    let day2 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate();

    currentDate.setDate(currentDate.getDate() - 1);
    let day3 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate()

    currentDate.setDate(currentDate.getDate() - 1);
    let day4 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate()

    currentDate.setDate(currentDate.getDate() - 1);
    let day5 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate()

    currentDate.setDate(currentDate.getDate() - 1);
    let day6 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate()

    currentDate.setDate(currentDate.getDate() - 1);
    let day7 = currentDate.getFullYear() + '-' + (currentDate.getMonth()) + '-' + currentDate.getDate()


    sql.query(`SELECT * FROM ( SELECT sum(quantityRED) AS numRed1, sum(quantityBLUE) AS numBlue1, sum(quantityWHITE) AS numWhite1 FROM FactoryOrders WHERE created_at BETWEEN '${day1} 00:00:00' AND '${day1} 23:59:59')d1 CROSS JOIN ( SELECT sum(quantityRED) AS numRed2, sum(quantityBLUE) AS numBlue2, sum(quantityWHITE) AS numWhite2 FROM FactoryOrders WHERE created_at BETWEEN '${day2} 00:00:00' AND '${day2} 23:59:59')d2 CROSS JOIN ( SELECT sum(quantityRED) AS numRed3, sum(quantityBLUE) AS numBlue3, sum(quantityWHITE) AS numWhite3 FROM FactoryOrders WHERE created_at BETWEEN '${day3} 00:00:00' AND '${day3} 23:59:59')d3 CROSS JOIN ( SELECT sum(quantityRED) AS numRed4, sum(quantityBLUE) AS numBlue4, sum(quantityWHITE) AS numWhite4 FROM FactoryOrders WHERE created_at BETWEEN '${day4} 00:00:00' AND '${day4} 23:59:59')d4 CROSS JOIN ( SELECT sum(quantityRED) AS numRed5, sum(quantityBLUE) AS numBlue5, sum(quantityWHITE) AS numWhite5 FROM FactoryOrders WHERE created_at BETWEEN '${day5} 00:00:00' AND '${day5} 23:59:59')d5 CROSS JOIN ( SELECT sum(quantityRED) AS numRed6, sum(quantityBLUE) AS numBlue6, sum(quantityWHITE) AS numWhite6 FROM FactoryOrders WHERE created_at BETWEEN '${day6} 00:00:00' AND '${day6} 23:59:59')d6 CROSS JOIN ( SELECT sum(quantityRED) AS numRed7, sum(quantityBLUE) AS numBlue7, sum(quantityWHITE) AS numWhite7 FROM FactoryOrders WHERE created_at BETWEEN '${day7} 00:00:00' AND '${day7} 23:59:59')d7;`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length){
            //console.log("7 Days Found.");
            result(null, res);
            return;
        }

        //not found Order with the id
        result({ kind: "not_found"}, null);

    });
}

LogIn.checkLogin = (data, result) => {
    var user = data.substring(0, data.indexOf(':'));
    var pass = data.substring(data.indexOf(':')+1, data.length);

    sql.query(`SELECT BINARY UserName = "${user}" AND BINARY Password = "${pass}" AS checkLogIn FROM LogIn;`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length){
            //console.log("UserName:", user, "\nPassword:" , pass);
            result(null, res);
            return;
        }

        result({ kind: "not_found"}, null);

    });
};

ItemPrice.checkPrice = (result) => {
    sql.query(`SELECT * FROM (SELECT (cust_price - prod_cost) AS redP FROM ItemPrice WHERE disk_color ="red")rp CROSS JOIN (SELECT (cust_price - prod_cost) AS blueP FROM ItemPrice WHERE disk_color ="blue") bp CROSS JOIN (SELECT (cust_price - prod_cost) AS whiteP FROM ItemPrice WHERE disk_color ="white") wp;`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length){
            //console.log("Prices Found");
            result(null, res);
            return;
        }

        result({ kind: "not_found"}, null);

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
            //console.log("Found Max OrderID: ", res[0]);
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
            //console.log("Found Max TransactionID: ", res[0]);
            result(null, res[0]);
            return;
        }
        
        //no orders were found
        result({ kind: "max TransactionID not found"}, null);
    });
};

FactoryOrder.getMaxJobID = (result) => {
    sql.query(`SELECT MAX(jobID) as jobID from FactoryJobs`, (err,res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            //console.log("Found Max JobID: ", res[0]);
            result(null, res[0]);
            return;
        }
        
        //no orders were found
        result({ kind: "max JobID not found"}, null);
    });
};

FactoryOrder.getFactoryOrderID = (jobID,  result) => {
    sql.query(`SELECT orderID FROM FactoryJobs WHERE jobID=?`, jobID, (err,res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            //console.log("Found orderID: ", res[0]);
            result(null, res[0]);
            return;
        }
        
        //no orders were found
        result({ kind: "not_found"}, null);
    });
};

FactoryOrder.getFactoryJobID = (result) => {
    sql.query(`SELECT current_job from FactoryStatus`, (err,res) => {
        if (err){
            //console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            //console.log("Found current_job: ", res[0]);
            result(null, res[0]);
            return;
        }
        
        //no orders were found
        result({ kind: "current_job not found"}, null);
    });
};

FactoryOrder.getPrices = (result) => {
    sql.query("SELECT cust_price FROM ItemPrice", (err, res) => {
        if (err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){
            //console.log("Found Max TransactionID: ", res);
            result(null, res);
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

        //console.log("Created order: ", {id: res.orderID, ...newFactoryOrder});
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

        //("Created transaction: ", {id: res.orderID, ...newFactoryTransaction});
        result(null, { id: res.orderID, ...newFactoryTransaction });

    });
};

// get last webcam frame
FactoryOrder.getWebcamFrame = (result) =>{
    sql.query("SELECT image_data FROM Webcam", (err, res) => {
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length){

            console.log("Found Webcam Frame: ");
            result(null, res[0]);
            return;
        }

        result({kind: "no frame found"}, null);
    })
}

module.exports = {FactoryOrder, FactoryTransaction, LogIn, ItemPrice};