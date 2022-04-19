// This file is meant to run alongside the server and MQTT broker
// to listen to the topics from the factory and update any 
// Database tables that are relevant. 

// RUN LISTENER WITH COMMAND 'sudo pm2 start MQTT_Listener.js'

const mqtt = require('mqtt');
const fs = require('fs');
const url = 'wss://onlyfactories.duckdns.org:9001';
let client = mqtt.connect(url);
const sql = require("./models/db.js");

client.on('connect', function(){
    client.subscribe('Factory/Echo');                           // test topic that will echo back a message
    client.subscribe('Factory/Inventory');                      // listen for messages about inventory
    client.subscribe('Factory/Status');                         // listen for messages about factory status
    client.subscribe('Factory/Job_notice');                     // listen for messages about Job updates
    client.subscribe('Factory/Webcam');		                // Get webcam frames	

    console.log('Client has subscribed successfully');
})

// Get timestamp with dateRange being how many days prior you want 
// the date for. 
function getTimestamp(dateRange){
    // timestamp for current time
    let currentDate = new Date();
    if(dateRange){
        currentDate.setDate(currentDate.getDate() - dateRange);
    }

    let updated_at = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-'
            + currentDate.getDate() + ' ' + currentDate.getHours() + ':'
            + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    
    return updated_at;
}

// When the client receives any message
client.on('message', function(topic, message){

    //if ordar status message is received
    if(topic == 'Factory/Echo'){
            console.log("Echo message Received")
        //console.log(message)
    }
    else{
        var msg = JSON.parse(message);

        // If an inventory message is received, parse the JSON message
        // and count red, blue, white quantities. Create new timestamp 
        // and inventory object to send to DB
        if(topic == 'Factory/Inventory'){

            // init red, blue, white vars
            let r = 0;
            let b = 0;
            let w = 0;

            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    switch(msg.Inventory[i][j]){
                        case 'red':
                            r += 1;
                            break;
                        case 'blue':
                            b += 1;
                            break;
                        case 'white':
                            w += 1;
                            break;
                        default:
                            break;
                    }
                }
            }

            let inventoryDetails = {
                quantityRed: r,
                quantityBlue: b,
                quantityWhite: w,
                updated_at: getTimestamp()
            }

            sql.query("UPDATE Inventory SET ?", inventoryDetails, (err, res) =>{
                if (err){
                    console.log("error: ", err);
                }
        
                console.log("Inventory updated: ", {quantityRed: res.quantityRed, ...inventoryDetails});
            });
            
        }
        //
        // IF FACTORY STATUS NOTICE MESSAGE IS RECEIVED
        //
        if(topic == 'Factory/Status'){

            let factoryStatusDetails = {
                factory_status: msg.factory_status,
                current_job: msg.current_job,
                job_queue_len: msg.job_queue_len,
                updated_at: getTimestamp()
            }

            sql.query("UPDATE FactoryStatus SET ?", factoryStatusDetails, (err, res) =>{
                if (err){
                    console.log("error: ", err);
                }
        
                console.log("Factory Status updated: ", {factory_status: res.factory_status, ...factoryStatusDetails});
            });
        }

        //
        // IF JOB STATUS NOTICE MESSAGE IS RECEIVED
        //
        if(topic == 'Factory/Job_notice'){           

            if(msg.msg_type == 'error'){
                // nothing for now
            }
            else{
                console.log("Job Notice received")
                console.log("====> ", msg);

                let jobID = msg.job_id;
                let jobStatus = msg.message;
                let orderID;
                let jobStatuses;
                let numRows;

                // update the jobStatus for specified jobID
                sql.query(`UPDATE FactoryJobs SET jobStatus=\"${jobStatus}\" WHERE jobID = ${jobID}`, (err, res) =>{
                    if (err){
                        console.log("error: ", err);
                    }
            
                    console.log(`JobID ${jobID} Status updated`);
                });

                console.log("BEFORE In Progress CHECK");
                //console.log("jobStatus: ", jobStatus);

                // if job is in progress, update main order
                if(jobStatus == 'in progress' || jobStatus == 'In progress' || jobStatus == 'In Progress' || jobStatus == 'Started' || jobStatus == 'started'){
                    // get orderID of job notice
                    //console.log("SELECT orderID FROM FactoryJobs WHERE jobID");

                    sql.query(`SELECT orderID FROM FactoryJobs WHERE jobID = ${jobID}`, (err, res) =>{
                        if (err){
                            console.log("error: ",err);
                        }
                        console.log("Line 154, res: ", res)
                        console.log("Line 155, res[0].orderID: ", res[0].orderID);
                        orderID = res[0].orderID;
                        //console.log("\tJOB NOTICE GET orderID: ", orderID);
                    });

                    let updateOrder = {
                        orderStatus: 'In progress',
                        updated_at: getTimestamp()
                    };

                    //console.log("UPDATE FactoryOrders SET ? WHERE orderID=");

                    console.log("Line 167, OrderID: ", orderID);
                    
                    sql.query(`UPDATE FactoryOrders SET ? WHERE orderID=${orderID}`, updateOrder, (err, res) =>{
                        if (err){
                            console.log("error: ", err);
                        }
                    });
                }

                console.log("BEFORE Complete CHECK")
                //console.log("jobStatus: ", jobStatus);
                // if job status is complete, check if all jobs in order are complete
                if(jobStatus == 'completed' || jobStatus == 'Completed' || jobStatus == 'complete' || jobStatus == 'Complete'){
                    //console.log("SELECT orderID FROM FactoryJobs WHERE jobID");
                    // get orderID of job notice
                    sql.query(`SELECT orderID FROM FactoryJobs WHERE jobID = ${jobID}`, (err, res) =>{
                        if (err){
                            console.log("error: ",err);
                        }

                        orderID = res[0].orderID;
                        //console.log("\tJOB NOTICE GET orderID: ", orderID);
                    });
                    

                    console.log("--->SELECT jobStatus FROM FactoryJobs WHERE orderID=" ,orderID);
                    // get jobStatuses for matching orderID
                    sql.query(`SELECT jobStatus FROM FactoryJobs WHERE orderID=${orderID}`, (err, res) =>{
                        if (err){
                            console.log("error: ",err);
                        }
                        
                        if(res.length){
                            numRows = res.length;
                        }
                        else{
                            numRows = 0;
                        }
                        
                        jobStatuses = res;
                        console.log("\tJOB STATUS GET jobStatus: ", jobStatuses[0]);
                    });                

                    let allJobsCompleted = true;

                    // iterate through all rows returned by previous query checking for complete status
                    for(let i = 0; i < numRows; i++){
                        if( jobStatuses[i].jobStatus != 'complete' || jobStatuses[i].jobStatus != 'Complete' || jobStatuses[i].jobStatus != 'completed' || jobStatuses[i].jobStatus != 'Completed'){
                            allJobsCompleted = false;
                        }
                    }

                    // if all jobs in order are complete, mark order complete
                    if(allJobsCompleted){

                        let updateOrder = {
                            orderStatus: 'Complete',
                            updated_at: getTimestamp()
                        };
                        
                        console.log("UPDATE FactoryOrders SET ? WHERE orderID=");
                        sql.query(`UPDATE FactoryOrders SET ? WHERE orderID=${orderID}`, updateOrder, (err, res) =>{
                            if (err){
                                console.log("error: ", err);
                            }
                        });
                    }
                }
            }
        }

        //
        // If webcam frame is received
        //
        if(topic == 'Factory/Webcam'){

            //when frame received, convert from base 64 to raw binary in buffer
            let image_slice = msg.image_data.slice(2,-1);
            let buff = Buffer.from(image_slice, 'base64');

            // store image in /images
            fs.writeFileSync('./images/webcam_frame.jpg', buff);
            //console.log('******** File created from base64 encoded string ********');  
            
            // create obj with image_data as base64
            let webcamFrame = {
                webcam_status: msg.webcam_status,
                image_data: buff,
                updated_at: getTimestamp()
            };

            // update webcam image as blob in mysql
            sql.query(`UPDATE Webcam SET ?`, webcamFrame, (err, res) => {
                if(err){
                    console.log("Error: ", err);
                }
            });

            //console.log("Webcam Frame updated")
        }
    }
});
