// This file is meant to run alongside the server and MQTT broker
// to listen to the topics from the factory and update any 
// Database tables that are relevant. 

// RUN LISTENER WITH COMMAND 'sudo pm2 start MQTT_Listener.js'

const mqtt = require('mqtt');
//const url = 'wss://onlyfactories.duckdns.org:9001';
const url = 'wss://localhost:9001';
const client = mqtt.connect(url);

client.on('connect', function(){
    client.subscribe('Factory/Echo');                           // test topic that will echo back a message
    client.subscribe('Factory/Inventory');                      // listen for messages about inventory
    client.subscribe('Factory/Status');                         // listen for messages about factory status
    client.subscribe('Factory/Job_notice');                     // listen for messages about Job updates

    console.log('Client has subscribed successfully');
})

client.on('message', function(topic, message, packet){

    // test topic that will echo back a message
    if (topic === 'Factory/Echo'){
        payload = message;
        console.log(message);
    }

    // messages about inventory
    if (topic === 'Factory/Inventory'){
        payload = message;
        console.log(message);

        //send REST API request to update factory inventory
    }

    // messages about factory status
    if (topic === 'Factory/Status'){
        payload = message;
        console.log(message);
    }

    // messages about Job updates
    if (topic === 'Factory/Job_notice'){
        payload = message;
        console.log(message);

        //send REST API request to update job ID status
    }
})