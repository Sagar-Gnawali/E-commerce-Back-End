const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		lowercase: true
	},
	email: {
		type: String,
		unique: true,
		sparse: true,
	},
	phoneNumber: {
		type: Number,
		min: 10,
		unique: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
	,
	address: {
		tempAddress: [String],
		perAddress: String
	},
	gender: {
		type: String,
		enum: ['male', 'female', 'others'],
		default: 'male'
	},
	status: {
		type: String,
		enum: ['active', 'inactive'],
		default: 'active'
	},
	dob: {
		type: Date
	},
	role: {
		type: Number,//1 for admin , 2 for general user and 3 for visitors
		enum: [1, 2, 3],
		default: 2
	},
	image: {
		type: String
	},
	passwordExipiry: Date
}, {
	timestamps: true
});

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;