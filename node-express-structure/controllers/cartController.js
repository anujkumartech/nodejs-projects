const products = require('../data/products.json'); // Need product data to validate adds

let cartItems = [];

const getCart = (req, res) => {
  res.status(200).json({ success: true, data: cartItems });
};

const addToCart = (req, res) => {
  const { productId, quantity = 1 } = req.body; // Get productId from request body, default quantity to 1

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: 'Product ID is required' });
  }

  const productToAdd = products.find((p) => p.id === productId);
  if (!productToAdd) {
    return res
      .status(404)
      .json({ success: false, message: `Product with id ${productId} not found` });
  }

  const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += parseInt(quantity, 10);
  } else {
    cartItems.push({
      productId: productToAdd.id,
      name: productToAdd.name,
      price: productToAdd.price,
      quantity: parseInt(quantity, 10)
    });
  }

  res.status(201).json({ success: true, message: 'Item added to cart', data: cartItems });
};

const removeFromCart = (req, res) => {
    const { productId } = req.params; 
    const initialLength = cartItems.length;
    cartItems = cartItems.filter(item => item.productId !== productId);

    if (cartItems.length === initialLength) {
        return res.status(404).json({ success: false, message: `Item with product id ${productId} not found in cart` });
    }

    res.status(200).json({ success: true, message: 'Item removed from cart', data: cartItems });
};

const updateCartItemQuantity = (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ success: false, message: 'Valid quantity is required (must be a number >= 0)' });
    }

    const itemIndex = cartItems.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: `Item with product id ${productId} not found in cart` });
    }

    if (quantity === 0) {
        cartItems.splice(itemIndex, 1);
         res.status(200).json({ success: true, message: 'Item removed due to zero quantity', data: cartItems });
    } else {
        cartItems[itemIndex].quantity = quantity;
        res.status(200).json({ success: true, message: 'Item quantity updated', data: cartItems });
    }
};


module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity
};