const router = require('express').Router();
const userModel = require('../models/user.model.js');
const user_mapper = require('../helpers/user_mapper.js')
const uploader = require('../middlewares/uploader.js');
const HashPassword = require('password-hash');
const jwt = require('jsonwebtoken');
const config = require('../configs/index.js');
const nodemailer = require('nodemailer');

const senderDetails = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'abc@gmail.com',
		pass: 'xxxxxxxxx'
	}

});
const prepareEmail = (data) => {
	return {
		from: 'Email recovery department ',//senders address
		to: "sagargnawali2@gmail.com," + data.email,//list of email receivers
		subject: 'Password recovery',//email subject
		text: 'Forgot password',//plain text
		html: `<p><strong>Dear ${data.name}</strong>,</p>
		<p>We are sending you this email because you requested a password reset.
		Click on this link to create a new password.</p>
		<p><a href=${data.link} target="_blank">Click here to set a new password</a></p>
		<p>If you did not request password reset, you can ignore this email.Your password will not be changed.</p>
		<p>Please contact your system administrator for support.</p>
		<p>(Please do not replay to this message,it's automated.)</p>
		<p>Regards,</p>
		<p>Gulmi Pvt. Ltd.</p>
		`
	}
}
const createToken = (user) => {
	const token = jwt.sign({
		_id: user._id
	}, config.jwt_payload);
	return token;
}

router.post('/login', (req, res, next) => {
	userModel.findOne({
		$or: [
			{ username: req.body.username },
			{ email: req.body.username }
		]
	})
		.then((user) => {
			if (!user) {
				return next({
					msg: "Sorry Cann't find that user !",
					status: 400
				})
			}
			if (user.status !== 'active') {
				return next({
					msg: "Sorry your account has been deactivated please contact your system administrator",
					status: 400
				})
			}
			let isMatched = HashPassword.verify(req.body.password, user.password);
			if (!isMatched) {
				return next({
					msg: "Invalid password. Please enter correct password !",
					status: 400
				})
			}
			let token = createToken(user);
			res.json({
				user,
				token
			});
		})
		.catch((error) => next(error));
})

router.post('/register', uploader.single('image'), (req, res, next) => {
	console.log('req file contains >>', req.file);
	if (req.fileTypeError) {
		return next({
			msg: 'Invalid file format',
			status: 400
		})
	}
	if (req.file) {
		req.body.image = req.file.filename;
	}
	const newUser = new userModel();
	let newMapperUser = user_mapper(newUser, req.body);
	newMapperUser.password = HashPassword.generate(req.body.password);
	newMapperUser.save((error, done) => {
		if (error) {
			return next(error);
		}
		res.json(done);
	})
});

router.post('/forgot-password', (req, res, next) => {
	userModel.findOne({
		email: req.body.email
	})
		.exec((error, user) => {
			if (error) {
				return next(error);
			}
			if (!user) {
				return next({
					msg: 'This email is not registered yet !',
					status: 404
				})
			}
			const emailContent = {
				name: user.username,
				email: user.email,
				link: `${req.headers.origin}/reset_password/${user._id}`
			}
			// Only 5 minutes for password recovery/reset time
			user.passwordExipiry = Date.now() + (1000 * 60 * 5);
			const emailBody = prepareEmail(emailContent);
			user.save((error, done) => {
				if (error) {
					return next(error);
				}
				senderDetails.sendMail(emailBody, function (error, done) {
					if (error) {
						return next(error);
					}
					res.json(done);
				})
				console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
				console.log('Done contains the >>', done);
			})
		})
})

router.post('/reset-password/:userId', (req, res, next) => {
	let userId = req.params.userId;
	userModel.findOne({
		_id: userId,
		passwordExipiry: {
			$gte: Date.now()
		}
	})
		.then(user => {
			if (!user) {
				return next({
					msg: 'Invalid/Expired password reset token !',
					status: 400
				})
			}
			user.password = HashPassword.generate(req.body.password);
			user.passwordExipiry = null;
			user.save((error, done) => {
				if (error) {
					return next(error);
				}
				res.json(done);
			})
		})
		.catch(error => {
			return next(error);
		})
})
router.get('/', (req, res, next) => {
	require('fs').readFile('data.txt', (error, done) => {
		if (error) {
			return req.myEvent.emit('error', error, res);
		}
	})
})
module.exports = router;