const mysql = require("mysql");
const dbConfig = require("~/NodeJS/config/db.config");

let database = null;

async function startDatabase(){
	// Create a connection to the database
	const connection = await mysql.createConnection({
	  host: dbConfig.HOST,
	  user: dbConfig.USER,
	  password: dbConfig.PASSWORD,
	  database: dbConfig.DB,
	  port      : dbConfig.PORT,
	  timeout   : dbConfig.TIMEOUT
	});

	database = connection.db();
}

async function getDatabase(){
	
	if (!database) await startDatabase();
	return database;
}

module.exports = {
	getDatabase,
	startDatabase,
};
