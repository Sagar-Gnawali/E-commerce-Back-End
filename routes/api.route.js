const router = require('express').Router();
const authenticate = require('../middlewares/authenticate.js');
const authRouter = require('../controller/auth.controller.js');
const userRouter = require('../controller/user.controller.js');
const productRouter = require('../components/products/product.route.js');
const isAdmin = require('../middlewares/isAdmin.js');

router.use('/auth', authRouter);
router.use('/user', authenticate, userRouter);
router.use('/product', productRouter);

module.exports = router;