const mongoose = require('mongoose');
const MONGO_URI = `mongodb+srv://admin:admin@cluster0.ddn04fm.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0`

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    // const conn = await mongoose.connect(process.env.CONNECTION_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;










// const conn = await mongoose.connect(process.env.CONNECTION_URL);