const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    // await mongoose.connect(MONGODB_URI, options);
    // console.log('MongoDB connected successfully');
    const conn = await mongoose.connect(MONGODB_URI);
    // const conn = await mongoose.connect(process.env.CONNECTION_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;