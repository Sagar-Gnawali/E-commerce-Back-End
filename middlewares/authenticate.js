const config = require('../configs/index.js');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');
module.exports = (req, res, next) => {
	let token;
	if (req.headers['x-access-token'])
		token = req.headers['x-access-token'];
	if (req.headers['authorization'])
		token = req.headers['authorization'];
	if (req.headers['token'])
		token = req.headers['token'];
	if (req.query.token)
		token = req.query.token;
	if (!token) {
		return next({
			msg: 'Authentication failed , token is not provied',
			status: 401
		})
	}
	else {
		jwt.verify(token, config.jwt_payload, (error, decoded) => {
			if (error) {
				return next(error);
			}
			UserModel.findById(decoded._id, (error, user) => {
				if (error) {
					return next(error);
				}
				if (!user) {
					return next({
						msg: 'Invalid/Expired token !',
						status: 400
					})
				}
				req.user = user;
				next();
			})
		})

	}
}