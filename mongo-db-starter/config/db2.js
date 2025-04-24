const { MongoClient } = require('mongodb');

const connectDB2 = async () => {
  try {
    const client = await MongoClient.connect(process.env.CONNECTION_URL);
    global.mongoClient = client;
    global.db = client.db();
    console.log(`MongoDB Connected: ${client.options.hosts[0]}`);
    return client;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB2;