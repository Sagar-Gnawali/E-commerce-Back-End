const ProductQuery = require('./product.query.js');
function get(req, res, next) {
	let condition = {};
	if (req.user.role !== 1) {
		condition.vendor = req.user._id;
	}
	ProductQuery.find(condition)
		.then((response) => res.json(response))
		.catch((error) => next(error));
}

function post(req, res, next) {
	const data = req.body;
	console.log('req files is >>', req.files);
	if (req.files) {
		data.images = req.files.map((file, index) => {
			return file.filename;
		})
	}
	if (req.body.tags)
		data.tags = typeof (req.body.tags) === 'string' ? req.body.tags.split(',') : req.body.tags;
	data.vendor = req.user._id;
	ProductQuery.insert(data)
		.then((response) => {
			res.json(response);
		})
		.catch((error) => {
			next(error);
		})
}
function getById(req, res, next) {
	const condition = {
		_id: req.params.id
	};
	ProductQuery.find(condition)
		.then((response) => {
			if (!response[0]) {
				return next({
					msg: 'Sorry that product was not found !',
					status: 400
				})
			}
			res.json(response[0])
		})
		.catch((error) => next(error));
}
function search(req, res, next) {
	const searchCondition = {};
	console.log('req body contains the >>', req.body)
	if (req.body.name)
		searchCondition.name = req.body.name
	if (req.body._id)
		searchCondition._id = req.body._id;
	if (req.body.category)
		searchCondition.category = req.body.category
	if (req.body.color)
		searchCondition.color = req.body.color;
	if (req.body.brand)
		searchCondition.brand = req.body.brand
	if (req.body.minPrice) {
		searchCondition.price = {
			$gte: req.body.minPrice
		}
	}
	if (req.body.maxPrice) {
		searchCondition.price = {
			$lte: req.body.maxPrice
		}
	}
	if (req.body.minPrice && req.body.maxPrice) {
		searchCondition.price = {
			$lte: req.body.maxPrice,
			$gte: req.body.minPrice
		}
	}
	if (req.body.fromDate && req.body.toDate) {
		const fromDate = new Date(req.body.fromDate).setHours(0, 0, 0,);
		const toDate = new Date(req.body.toDate).setHours(23, 59, 59, 999);
		searchCondition.createdAt = {
			$gte: new Date(fromDate),
			$lte: new Date(toDate)
		}
	}
	if (req.body.tags) {
		searchCondition.tags = {
			$in: req.body.tags.split(',')
		}
	}

	console.log('searchCondition is >>', searchCondition);
	ProductQuery.find(searchCondition)
		.then((response) => res.json(response))
		.catch((error) => next(error));
}
function remove(req, res, next) {
	ProductQuery.remove(req.params.id)
		.then((response) => {
			if (!response) {
				return next({
					msg: 'Product not found may be already removed',
					status: 400
				})
			}
			res.json(response);
		})
		.catch((error) => {
			return next(error);
		})
}
function addRatings(req, res, next) {
	const data = req.body;
	ProductQuery.addRatings(req.params.id, data)
		.then((response) => res.json(response))
		.catch((error) => next(error));
}
function update(req, res, next) {
	const data = req.body;
	console.log('Prouct update is also called ', data);
	if (req.files.length > 0) {
		console.log('Req files contains the ', req.files);
		data.images = req.files.map((file, index) => {
			return file.filename;
		})
	}
	ProductQuery.update(req.params.id, data)
		.then((response) => res.json(response))
		.catch((error) => next(error))
}
module.exports = {
	get,
	post,
	getById,
	search,
	remove,
	addRatings,
	update
}