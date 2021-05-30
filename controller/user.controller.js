const router = require('express').Router();
const UserModel = require('../models/user.model.js');
const user_mapper = require('../helpers/user_mapper.js');
router.route('/')
	.get((req, res, next) => {
		UserModel
			.find({

			})
			.sort({
				_id: -1
			})
			.exec()
			.then((response) => res.json(response))
			.catch((error) => next(error));
	})

router.route('/:id')
	.get((req, res, next) => {
		UserModel.findOne({
			_id: req.params.id
		})
			.then((user) => {
				if (!user) {
					return next({
						msg: 'Sorry user not found !',
						status: 404
					})
				}
				res.json(user)
			})
			.catch((error) => next(error));
	})
	.put((req, res, next) => {
		UserModel.findById({
			_id: req.params.id
		})
			.then((user) => {
				if (!user) {
					return next({
						msg: "Sorry that user doesn't exist",
						status: 404
					})
				}
				const UpdatedUser = user_mapper(user, req.body);
				UpdatedUser.save()
					.then((updated) => res.json(updated))
					.catch((error) => next(error));
			})
	})
	.delete((req, res, next) => {
		if (req.user.role !== 1) {
			return next({
				msg: "You don't have access to remove users from database ",
				status: 403
			})
		}
		console.log("req user is", req.user);
		UserModel.findById(req.params.id, (error, user) => {
			if (error) {
				return next(error);
			}

			if (!user) {
				return next({
					msg: "Sorry user not found",
					status: 404
				})
			}
			console.log('Req body is >>', user.role);
			user.remove((error, remove) => {
				if (error) {
					return next(error)
				}
				res.json(remove);
			})

		})
	})
module.exports = router;