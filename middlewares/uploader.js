const multer = require('multer');
const path = require('path');

console.log('directory file is >>', process.cwd());
const storeData = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(process.cwd(), 'uploads/images'));
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	}
});

const typeFilter = (req, file, callback) => {
	const mimeType = file.mimetype.split('/')[0];
	if (mimeType === 'image') {
		callback(null, true);
	} else {
		req.fileTypeError = true;
		callback(null, false);
	}
}

const upload = multer({
	storage: storeData,
	fileFilter: typeFilter
})

module.exports = upload;