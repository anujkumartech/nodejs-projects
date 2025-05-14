const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());


const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 3, 
  message: {
   error: 'Too many requests',
   retryAfter: '1 minute',
   limit: '3 requests per minute per IP'
  },
  standardHeaders: true, 
  legacyHeaders: false
 });
app.use(limiter); 

let secureSubmissions = [];
let insecureSubmissions = [];

function sanitizeXSS(input) {
 if (typeof input !== 'string') return input;
 
 return input
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#x27;')
  .replace(/\//g, '&#x2F;');
}

function sanitizeObject(obj) {
 if (typeof obj === 'string') {
  return sanitizeXSS(obj);
 } else if (Array.isArray(obj)) {
  return obj.map(sanitizeObject);
 } else if (obj !== null && typeof obj === 'object') {
  const sanitized = {};
  for (const key in obj) {
   sanitized[key] = sanitizeObject(obj[key]);
  }
  return sanitized;
 }
 return obj;
}

app.get('/', (req, res) => {
 res.json({
  status: 'OK',
  message: 'Node.js Security Demo API',
  version: '1.0.0',
  security: 'Protected by Helmet',
  new_endpoints: {
   secure: 'POST /api/submit-secure (with xss-clean)',
   insecure: 'POST /api/submit-insecure (vulnerable to XSS)'
  }
 });
});

app.get('/api/security-info', (req, res) => {
 res.json({
  message: 'Security headers are automatically added by Helmet',
  headers_added: {
   'Content-Security-Policy': 'Prevents XSS and injection attacks',
   'X-Content-Type-Options': 'nosniff - Prevents MIME type sniffing',
   'X-Frame-Options': 'DENY - Prevents clickjacking',
   'X-XSS-Protection': '1; mode=block - Enables XSS protection',
   'Strict-Transport-Security': 'Forces HTTPS in production'
  },
  how_to_check: 'Use: curl -I http://localhost:' + PORT + '/api/security-info'
 });
});

app.get('/api/users', (req, res) => {
 res.json({
  users: [
   { id: 1, name: 'John Doe', email: 'john@example.com' },
   { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ],
  security_note: 'This response includes security headers from Helmet'
 });
});

app.post('/api/users', express.json(), (req, res) => {
 res.json({
  message: 'User created successfully',
  user: req.body,
  security_note: 'All requests are protected by Helmet security headers'
 });
});

app.post('/api/submit-secure', express.json(), (req, res) => {
 const { message } = req.body;
 
 if (!message) {
  return res.status(400).json({ error: 'Message is required' });
 }
 
 const originalMessage = message;
 
 const sanitizedMessage = sanitizeXSS(message);
 
 secureSubmissions.push({
  id: Date.now(),
  message: sanitizedMessage,
  timestamp: new Date().toISOString(),
  sanitized: true
 });
 
 res.json({
  status: 'success',
  message: 'Message submitted securely',
  data: {
   original_message: originalMessage,
   sanitized_message: sanitizedMessage,
   note: 'Custom XSS sanitization has cleaned any malicious scripts'
  }
 });
});

app.post('/api/submit-insecure', express.json(), (req, res) => {
 const { message } = req.body;
 
 if (!message) {
  return res.status(400).json({ error: 'Message is required' });
 }
 
 insecureSubmissions.push({
  id: Date.now(),
  message: message, 
  timestamp: new Date().toISOString(),
  sanitized: false
 });
 
 res.json({
  status: 'success',
  message: 'Message submitted (VULNERABLE)',
  data: {
   message: message, 
   warning: 'This endpoint is vulnerable to XSS attacks!'
  }
 });
});

app.get('/api/submissions', (req, res) => {
 res.json({
  secure_submissions: secureSubmissions,
  insecure_submissions: insecureSubmissions,
  note: 'Compare how the same XSS payload is handled differently'
 });
});

app.get('/api/helmet-options', (req, res) => {
 res.json({
  basic_usage: "app.use(helmet())",
  advanced_configuration: {
   contentSecurityPolicy: "Configure CSP directives",
   hsts: "Set HTTPS enforcement",
   frameguard: "Prevent clickjacking",
   noSniff: "Prevent MIME type sniffing",
   xssFilter: "Enable XSS protection",
   referrerPolicy: "Control referrer information"
  },
  example: `
   app.use(helmet({
    contentSecurityPolicy: {
     directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
     }
    }
   }))
  `,
  xss_protection: {
   approach: "Custom sanitization function",
   note: "xss-clean is deprecated and incompatible with newer Express versions",
   alternatives: ["express-validator", "dompurify", "sanitize-html"],
   custom_implementation: "Manual character escaping for educational purposes"
  }
 });
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).json({
  error: 'Something went wrong!',
  note: 'Even error responses include Helmet security headers'
 });
});

app.use((req, res) => {
 res.status(404).json({
  error: 'Route not found',
  available_routes: [
   'GET /',
   'GET /api/security-info',
   'GET /api/users',
   'POST /api/users',
   'GET /api/helmet-options',
   'POST /api/submit-secure (with xss-clean)',
   'POST /api/submit-insecure (vulnerable)',
   'GET /api/submissions',
   'GET /xss-demo'
  ]
 });
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
 console.log('\n=== XSS Demo URLs ===');
 console.log(`Interactive Demo: http://localhost:${PORT}/xss-demo`);
 console.log('\n=== Test with curl ===');
 console.log(`Secure: curl -X POST http://localhost:${PORT}/api/submit-secure -H "Content-Type: application/json" -d '{"message":"<script>alert(\\'XSS\\')</script>"}'`);
 console.log(`Insecure: curl -X POST http://localhost:${PORT}/api/submit-insecure -H "Content-Type: application/json" -d '{"message":"<script>alert(\\'XSS\\')</script>"}'`);
 console.log(`\nNote: Using custom XSS sanitization due to xss-clean compatibility issues`);
 console.log('Alternative: npm install express-validator for production use');
});

module.exports = app;
