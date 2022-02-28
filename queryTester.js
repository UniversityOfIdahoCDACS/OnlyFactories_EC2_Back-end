const sql = require("./models/db.js")
const readline = require("readline");

var input = "START";

const readInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log('1. `SELECT orderID FROM FactoryJobs WHERE jobID = 4`');
console.log('2. `SELECT jobStatus FROM FactoryJobs WHERE orderID = 14258`');
console.log('q. QUIT');

function runProgram(){
    readInput.question('Test Program to run Queries. Select number of query to run: ', input =>{
        switch(input){
                case '1':

                    sql.query(`SELECT orderID FROM FactoryJobs WHERE jobID = 4`, (err, res) =>{
                        if (err){
                            console.log("error: ",err);
                        }
    
                        console.log(res);
                        console.log(res[0].orderID);
                    });
                    break;

                case '2':
                    // get jobStatuses for matching orderID
                    let jobStatus;

                    sql.query(`SELECT jobStatus FROM FactoryJobs WHERE orderID=14258`, (err, res) =>{
                        if (err){
                            console.log("error: ",err);
                          }
                        jobStatus = res;
                        numRows = res.length;
                        for(let i = 0; i < numRows; i++){
                            console.log('Loop ',i)
                            console.log(jobStatus[i].jobStatus)
                        }
                    });
                    break;

                case 'q':
                    readInput.close();

                default:
                    break;
            }
        runProgram()
    })
}

runProgram();

readInput.on('close', function(){
    console.log('\nProgram Exiting');
    process.exit(0);
})