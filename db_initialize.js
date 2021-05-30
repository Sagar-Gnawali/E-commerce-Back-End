const mongoose = require('mongoose');
const dbDetails = require('./configs/db.config.js');
const url = dbDetails.database_url + '/' + dbDetails.database_name;

mongoose.connect(url, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: true,
	useCreateIndex: true
})
mongoose.connection.once('open', () => {
	console.log('db Connection is now open');
})
mongoose.connection.on('err',()=>{
	console.log('db Connection is failed');
})