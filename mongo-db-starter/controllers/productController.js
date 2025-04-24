const Product = require('../models/product');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    //const product = await Product.findOne({ productId: id });
    const product = await Product.findOne({ productId: { $regex: id, $options: 'i' } });
    
    
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: `Product with id ${id} not found` });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductSortedByDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.find({}).sort({discount: -1});
    
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: `Product with id ${id} not found` });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Create a new product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const createProduct2 = async (req, res) => {
  try {
    const collection = global.db.collection('products');
    const result = await collection.insertOne(req.body);
    
    const product = {
      _id: result.insertedId,
      ...req.body
    };
    console.log('create product 2');
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = createProduct;
// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate(
      { productId: id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: `Product with id ${id} not found` });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ productId: id });
    
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: `Product with id ${id} not found` });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProduct2,
  getProductSortedByDiscount
};