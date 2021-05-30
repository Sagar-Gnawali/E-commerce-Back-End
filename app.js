const express = require('express');
const app = express();
const config = require('./configs/index.js');
const morgan = require('morgan');
const APIRoutes = require('./routes/api.route.js');
const cors = require('cors');
const path = require('path');
require('./db_initialize.js');
const events = require('events');
const myEvent = new events.EventEmitter();
myEvent.on('error', (error, res) => {
	console.log('Im in at error listener', error);
	res.json(error);
})
app.use((req, res, next) => {
	req.myEvent = myEvent;
	next();
})
require('./socket.js')(app)

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(morgan('dev'));
app.use(cors());
app.use('/file', express.static(path.join(__dirname, 'uploads')));
app.get('/home', (req, res, next) => {
	res.json('Home page of main file !');
})
app.use('/api', APIRoutes);
app.use((err, req, res, next) => {
	console.log('error in err is >>', err);
	res.status(err.status || 400)
	res.json({
		msg: err.msg || err || 'Error from application',
		status: err.status || req.statusCode || res.statusCode
	})
})
app.use((req, res, next) => {
	res.status(400);
	res.json({
		msg: 'Not found  ',
		status: 400
	})
})
app.listen(config.port, (error, done) => {
	if (error) {
		console.log('Error in listening to the server..!!');
	} else {
		console.log(`Server is listening at port no: ${config.port}`)
	}
});

