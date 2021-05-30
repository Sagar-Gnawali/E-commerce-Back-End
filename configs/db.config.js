const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const database_url = 'mongodb://localhost:27017';
const database_name = 'ecommerce';
const object_id = mongodb.ObjectId;
module.exports = {
	MongoClient: MongoClient,
	database_url: database_url,
	database_name: database_name,
	object_id: object_id
} 