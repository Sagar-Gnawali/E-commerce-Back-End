const router = require('express').Router();
const ProductController = require('./product.controller.js');
const authenticate = require('../../middlewares/authenticate.js');
const Uploader = require('../../middlewares/Uploader.js');

router.route('/')
    .get(authenticate, ProductController.get)
    .post(authenticate, Uploader.array('image'), ProductController.post);

router.route('/search')
    .get(ProductController.search)
    .post(ProductController.search);

router.route('/:id')
    .get(authenticate, ProductController.getById)
    .put(authenticate, Uploader.array('image'), ProductController.update)
    .delete(authenticate, ProductController.remove);

router.route('/add-ratings/:id')
    .post(authenticate, ProductController.addRatings)

module.exports = router; 