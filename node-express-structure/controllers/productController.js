const products = require('../data/products.json');

const getAllProducts = (req, res) => {
  res.status(200).json({ success: true, data: products });
};

const getProductById = (req, res) => {
  const { id } = req.params; 
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: `Product with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: product });
};

module.exports = {
  getAllProducts,
  getProductById,
};