const express = require('express');

const logger = require('./middleware/logger');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const connectDB = require('./config/db');
const connectDB2 = require('./config/db2');
require('dotenv').config();

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running. Use /api/products or /api/cart routes.' });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5005;


connectDB() // Call the function to establish connection
  .then(() => {
    console.log('Database connection established');
    connectDB2() // Call the function to establish connection
      .then(() => {
        console.log('Database2 connection established');
        app.listen(PORT, () => {
          console.log(`API Server running on port ${PORT}`);
        });
      })
      .catch(err => {
        console.error('Failed to connect to database:', err);
      });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
  });
