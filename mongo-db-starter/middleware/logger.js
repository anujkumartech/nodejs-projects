// Simple logging middleware
const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const time = new Date().toLocaleTimeString();
    console.log(`Logger Middleware: [${time}] ${method} ${url}`);
    next();
  };
  
  module.exports = logger;