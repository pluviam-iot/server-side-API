var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://madalozzo:C0nnect123@localhost:27017/pluviam?authMechanism=DEFAULT&authSource=db';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
	console.log("Connected correctly to server");

	db.close();
});
