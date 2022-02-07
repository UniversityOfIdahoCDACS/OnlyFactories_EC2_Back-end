const mqtt = require("mqtt");

// 2 possible urls, need to check which one works

//const url = 'wss://onlyfactories.duckdns.org:9001';
const url = 'wss://localhost:9001';
const client = mqtt.connect(url);
const topic = 'UofICapstone_Cloud';

// send job over MQTT to 
app.get('/mqtt/sendNewJob', (req, res) => {

  let msg_type = 'new_job';

  let {job_id, order_id, color, cook_time, slice} = req.body;
  let payload = [[req.body.job_id, req.body.order_id, req.body.color, req.body.cook_time, req.body.slice]];

  // Publish over MQTT if payload isn't empty and client is connected
  if payload[0][0] != null{
    if client.connected == true{
      // need to verify what qos we want, testing with qos=2 here which would verify that
      //the Python subscriber received the messaged ONLY once
      client.publish(topic, {msg_type, payload});
    } 
  }
})
// END

// send cancel order message by job ID
app.get('/mqtt/cancelByJobId', (req, res) => {
  let msg_type = 'cancel_job_id';

  let {job_id} = req.body;
  let payload = [[req.body.job_id]]

  // Publish over MQTT if payload isn't empty and client is connected
  if payload[0][0] != null{
    if client.connected == true{
      // need to verify what qos we want, testing with qos=1 here which would verify that
      //the Python subscriber received the messaged atleast once
      client.publish(topic, {msg_type, payload}, qos=1);
    }
  }
})
// END

// send cancel order message by order ID
app.get('/mqtt/cancelByOrderId', (req, res) => {
  let msg_type = 'cancel_order_id';

  let {order_id} = req.body;
  let payload = [[req.body.order_id]]

  // Publish over MQTT if payload isn't empty and client is connected
  if payload[0][0] != null{
    if client.connected == true{
      // need to verify what qos we want, testing with qos=1 here which would verify that
      //the Python subscriber received the messaged atleast once
      client.publish(topic, {msg_type, payload}, qos=1);
    }
  }
})
// END

// update the inventory when mqtt listener receives an inventory update
app.put('/mqtt/updateInventory', (req, res) => {
  console.log('Update Inventory Call');
})
// END

// update status of Job when mqtt listener receives update of jobID
app.put('/mqtt/updateJobStatus/:job_id', (req, res) => {
  job_ID = req.params.job_id;

  console.log(job_ID);
})
// END