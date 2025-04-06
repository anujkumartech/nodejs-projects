const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity
} = require('../controllers/cartController');

router.get('/', getCart);

router.post('/', addToCart);

router.delete('/:productId', removeFromCart);

router.post('/:productId', updateCartItemQuantity);

module.exports = router;