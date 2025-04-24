const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: [true, "Please pass description of the product as it is needed."]
  },
  brandname: {
    type: String
  },
  discount: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);