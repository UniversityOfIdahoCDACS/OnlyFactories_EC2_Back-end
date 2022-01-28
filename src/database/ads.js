// ./src/database/ads.js

const {getDatabase} = require('./db');

const collectionName = 'ads';

async function insertAd(ad){
	const database = await getDatabase();
	const {insertedID} = await.database.collection(collectionName).insertOne(ad);
	return insertedID;
}

async function getAds(){
	const database = await getDatabase();
	return await database.collection(collectionName).find({}).toArray();
}

module.exports = {
	insertAd,
	getAds,
};
