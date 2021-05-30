const ProductModel = require('./product.model.js');
const rating_mapper = require('../../helpers/rating_mapper.js');
const product_mapper = (product, productDetails) => {
	if (productDetails.name)
		product.name = productDetails.name;
	if (productDetails.description)
		product.description = productDetails.description;
	if (productDetails.brand)
		product.brand = productDetails.brand
	if (productDetails.category)
		product.category = productDetails.category;
	if (productDetails.modelNumber)
		product.modelNumber = productDetails.modelNumber
	if (productDetails.price)
		product.price = productDetails.price;
	if (productDetails.color)
		product.color = productDetails.color;
	if (productDetails.status)
		product.status = productDetails.status;
	if (productDetails.size)
		product.size = productDetails.size;
	if (productDetails.images)
		product.images = productDetails.images;
	if (productDetails.warrantyStatus)
		product.warrantyStatus = productDetails.warrantyStatus;
	if (productDetails.warrantyPeriod)
		product.warrantyPeriod = productDetails.warrantyPeriod;
	if (productDetails.isReturnEligible)
		product.isReturnEligible = productDetails.isReturnEligible;
	if (productDetails.isFeatured)
		product.isFeatured = productDetails.isFeatured;
	if (productDetails.quantity)
		product.quantity = productDetails.quantity;
	if (productDetails.vendor)
		product.vendor = Object.keys(productDetails.vendor).length
			? productDetails.vendor._id
			: productDetails.vendor;
	if (!product.discount)
		product.discount = {};
	if (productDetails.discountedItem)
		product.discount.discountedItem = productDetails.discountedItem;
	if (productDetails.discountType)
		product.discount.discountType = productDetails.discountType;
	if (productDetails.discountValue)
		product.discount.discountValue = productDetails.discountValue;
	if (productDetails.tags) {
		product.tags = (typeof (productDetails.tags) === 'string')
			? productDetails.tags.split(',')
			: productDetails.tags;
	}
	if (productDetails.manuDate)
		product.manuDate = productDetails.manuDate;
	if (productDetails.exipiryDate)
		product.exipiryDate = productDetails.exipiryDate;

}
const find = (condition) => {
	return ProductModel
		.find(condition)
		.sort({
			_id: -1
		})
		.populate('vendor', {
			username: 1,
			role: 1
		})
		.exec();
}
const insert = (data) => {
	const newProduct = new ProductModel();
	product_mapper(newProduct, data);
	return newProduct.save();

}
const update = (id, data) => {
	return new Promise((resolve, reject) => {
		ProductModel.findById(id, (error, product) => {
			if (error) {
				return reject(error);
			}
			if (!product) {
				return reject({
					msg: "Sorry that product not found !",
					status: 404
				})
			}
			product_mapper(product, data);
			product.save((error, updated) => {
				if (error) {
					return reject(error);
				}
				resolve(updated);
			})
		})
	})
}
const remove = (id) => {
	return ProductModel.findByIdAndRemove(id);
}
const addRatings = (productId, data) => {
	return new Promise((resolve, reject) => {
		ProductModel.findById(productId, (error, product) => {
			if (error) {
				return reject(error);
			}
			if (!product) {
				return reject({
					msg: "Sorry can't find that product",
					status: 400
				});
			}
			var update = rating_mapper({}, data);
			console.log('Ratings is >>', update);
			product.ratings.push(update);
			product.save((error, added) => {
				if (error) {
					return reject(error);
				}
				resolve(added);
			})
		})
	})
}
module.exports = {
	find: find,
	insert: insert,
	update: update,
	remove: remove,
	addRatings: addRatings
}