const express = require('express');
const router = express.Router();
const validateRequestBody = require('../middleware/productMiddleware');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProduct2,
  getProductSortedByDiscount
} = require('../controllers/productController');

// GET all products
router.get('/', getAllProducts);

// GET single product by ID
router.get('/:id', getProductById);

// GET single product by ID
router.get('/sort/discount', getProductSortedByDiscount);

// POST create new product
router.post('/', validateRequestBody, createProduct);

// PUT update product
router.put('/:id', validateRequestBody, updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;

// product route -> product controller -> Mongoose Schema -> Database connection -> Mongodb compass