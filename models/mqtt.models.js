// models for mqtt

const sql = require("./db.js");

//Constructor
const MQTT_Task = function(newInventory) {
    
    this.quantityRED = newInventory.quantityRED;
    this.quantityBLUE = newInventory.quantityBLUE;
    this.quantityWHITE = newInventory.quantityWHITE;
};

MQTT.addJobToDB = (newFactoryJob, result) =>{
    sql.query("INSERT INTO FactoryJobs SET ?", newFactoryJob, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Created order: ", {id: res.insertId, ...newFactoryJob});
        result(null, { id: res.insertId, ...newFactoryJob });

    });
};

MQTT.sendNewJob = (id, result) => {
    
};

MQTT.cancelByJobId = (dataRange, result) => {
    
};

MQTT.cancelByOrderId = (result) => {
    
};

MQTT.updateInventory = (result) => {
    
};

module.exports = MQTT_Task;