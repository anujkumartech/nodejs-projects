const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/product');

const generateRandomProducts = (count) => {
  const products = [];
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP', 'Ikea', 'Amazon'];
  
  for (let i = 1; i <= count; i++) {
    products.push({
      productId: `p${i}`,
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 500) + 10,
      description: `This is a description for product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      inStock: Math.random() > 0.2,
      rating: (Math.random() * 4 + 1).toFixed(1),
      imageUrl: `https://example.com/images/product${i}.jpg`,
      brandname: brands[Math.floor(Math.random() * brands.length)],
      discount: Math.floor(Math.random() * 50) // Random discount between 0-49%
    });
  }
  
  return products;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await Product.deleteMany({});
    console.log('Products collection cleared');
    
    const products = generateRandomProducts(20);
    
    await Product.insertMany(products);
    console.log('20 products inserted successfully!');
    
    const sampleProducts = await Product.find().limit(3);
    console.log('Sample of added products:');
    console.log(sampleProducts);
    
    await mongoose.disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();