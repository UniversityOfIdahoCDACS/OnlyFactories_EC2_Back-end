// models for mqtt

const sql = require("./db.js");
const mqtt = require("mqtt");
const url = 'wss://onlyfactories.duckdns.org:9001';

//Constructor

const MQTT_Task = function(params) {

    this.jobID = params.jobID;
    this.orderID = params.orderID;
    this.disk_color = params.disk_color;
    this.jobStatus = params.jobStatus;    
};

const MQTT_Msg = function(params){
    this.msg_type = params.msg_type;
    this.payload = params.payload;
}

MQTT_Task.addJobToDB = (newFactoryJob, result) =>{

    sql.query("INSERT INTO FactoryJobs SET ?", newFactoryJob, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Created order: ", {id: res.jobID, ...newFactoryJob});
        result(null, { id: res.jobID, ...newFactoryJob });

    });
};

MQTT_Msg.sendNewJob = (newFactoryJob, result) => {
    let client = mqtt.connect(url);
    console.log(newFactoryJob);
    const payload = JSON.stringify(newFactoryJob);

    client.on("connect", function(){        
        console.log(payload);
        //client.publish('UofICapstone_Cloud', payload, qos=1);
        client.publish('UofICapstone_Cloud', payload, qos=2);
    })

    result(null, payload);
};

MQTT_Task.cancelByJobId = (jobID, result) => {
    
    let msg_type = 'cancel_job_id';
    
};

MQTT_Task.cancelByOrderId = (orderID,result) => {

    let msg_type = 'cancel_order_id';
   
};

MQTT_Msg.sendInventoryRefresh = (data, result) => {

    let client = mqtt.connect(url);
    const msg = {
        "msg_type": "reset_inventory"
    }
    const payload = JSON.stringify(msg);

    client.on("connect", function(){        
        client.publish('UofICapstone_Cloud', payload, qos=2);
    })

    result(null, payload);
}

module.exports = {MQTT_Task, MQTT_Msg};
