const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RatingsSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	point: {
		type: Number,
		min: 1,
		max: 5
	},
	message: {
		type: String
	}
}, {
	timestamps: true
});
const ProductSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	brand: {
		type: String
	},
	category: {
		type: String,
		required: true
	},
	modelNumber: {
		type: String
	},
	price: {
		type: Number
	},
	color: {
		type: String
	},
	status: {
		type: String,
		enum: ['available', 'out-of-stock', 'booked'],
		default: 'available'
	},
	ratings: [RatingsSchema],
	size: {
		type: String
	},
	images: [String],
	warrantyStatus: Boolean,
	warrantyPeriod: String,
	isReturnEligible: Boolean,
	isFeatured: Boolean,
	quantity: Number,
	vendor: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	discount: {
		discountedItem: Boolean,
		discountType: {
			type: String,
			enum: ['percentage', 'quantity', 'value']
		},
		discountValue: String
	},
	tags: [String],
	manuDate: Date,
	exipiryDate: Date

}, {
	timestamps: true
});
module.exports = mongoose.model('product', ProductSchema);