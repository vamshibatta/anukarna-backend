const { Router } = require("express");
let router = Router();

router.use('/user', require('./user.js'));
router.use('/product', require('./product.js'));
router.use('/cart', require('./cart.js'));

module.exports = router;