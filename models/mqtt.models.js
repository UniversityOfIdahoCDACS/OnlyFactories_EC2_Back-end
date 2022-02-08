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

MQTT.cancelByJobId = (jobID, result) => {
    
    let msg_type = 'cancel_job_id';
    let job_id = orderID;

    // Publish over MQTT if payload isn't empty and client is connected
    if (job_id){
        if client.connected == true{
        // need to verify what qos we want, testing with qos=1 here which would verify that
        //the Python subscriber received the messaged atleast once
        client.publish(topic, {msg_type, payload}, qos=1);
        }
    }
};

MQTT.cancelByOrderId = (orderID,result) => {

    let msg_type = 'cancel_order_id';
    let order_id = orderID;

    // Publish over MQTT if payload isn't empty and client is connected
    if (orderID){
        if client.connected == true{
        // need to verify what qos we want, testing with qos=1 here which would verify that
        //the Python subscriber received the messaged atleast once
        client.publish(topic, {msg_type, payload}, qos=1);
        }
    }
};

MQTT.updateInventory = (result) => {
    
};

module.exports = MQTT_Task;