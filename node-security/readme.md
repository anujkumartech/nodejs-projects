# Node.js Security

## Overview
This project demonstrates important security concepts in Node.js applications, specifically focusing on:
- HTTP security headers (helmet)
- Cross-Origin Resource Sharing (CORS)
- Cross-Site Scripting (XSS) prevention
- Rate limiting for DDoS protection

## 🔒 Security Concepts Covered

### 1. **Helmet** - HTTP Security Headers

**Theory**: Helmet is a middleware that sets various HTTP headers to help protect your application from well-known vulnerabilities. It's essentially a collection of smaller middleware functions that set security headers.

**Headers Helmet Sets**:
- `Content-Security-Policy` - Prevents XSS attacks by controlling which resources can be loaded
- `X-Content-Type-Options: nosniff` - Prevents browsers from MIME-type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables browser's built-in XSS protection
- `Strict-Transport-Security` - Forces HTTPS connections (in production)
- `Referrer-Policy` - Controls how much referrer information should be included

**Implementation**:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Why It Matters**: These headers are your first line of defense against common web vulnerabilities. They work at the HTTP level to prevent various attacks before malicious code can even execute.

### 2. **CORS** - Cross-Origin Resource Sharing

**Theory**: CORS is a mechanism that allows web pages from one domain to access resources from another domain. By default, browsers block these cross-origin requests for security reasons.

**How It Works**:
1. Browser checks the origin of the request
2. If cross-origin, it sends a preflight request (for non-simple requests)
3. Server responds with allowed origins in `Access-Control-Allow-Origin` header
4. Browser either allows or blocks the request based on the response

**Implementation**:
```javascript
const cors = require('cors');
app.use(cors()); // Allows all origins in development
```

**Security Considerations**:
- Never use `*` (all origins) in production
- Specify exact domains: `{ origin: 'https://yourdomain.com' }`
- Be careful with credentials: `{ credentials: true }`

### 3. **XSS Prevention** (Cross-Site Scripting)

**Theory**: XSS attacks occur when malicious scripts are injected into web pages viewed by other users. This happens when user input is not properly sanitized before being displayed.

**Types of XSS**:
1. **Stored XSS**: Malicious script is stored on the server (database) and executed when retrieved
2. **Reflected XSS**: Script is reflected off the server (like in URL parameters)
3. **DOM-based XSS**: Script executes directly in the browser's DOM

**Prevention Methods**:
1. **Input Sanitization**: Clean user input before storing/processing
2. **Output Encoding**: Escape data before displaying to users
3. **Content Security Policy**: Restrict which scripts can execute

**Note**: `xss-clean` is deprecated. This demo uses a custom sanitization function:
```javascript
function sanitizeXSS(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

**Modern Alternatives**:
- `express-validator`
- `sanitize-html`
- `dompurify`

### 4. **Express Rate Limit** - DDoS Protection

**Theory**: Rate limiting controls how many requests a user can make within a specified time window. This prevents:
- Denial of Service (DoS) attacks
- Brute force attacks
- Resource exhaustion
- API abuse

**How It Works**:
1. Track requests per identifier (usually IP address)
2. Count requests within a sliding time window
3. Block requests that exceed the limit
4. Reset counters after the time window expires

**Implementation**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute per IP
  message: {
    error: 'Too many requests',
    retryAfter: '1 minute',
    limit: '3 requests per minute per IP'
  }
});

app.use(limiter);
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## 📋 Available Endpoints

### Security Information
- `GET /` - API overview
- `GET /api/security-info` - Security headers information
- `GET /api/helmet-options` - Helmet configuration examples

### User Endpoints
- `GET /api/users` - Get all users (demo data)
- `POST /api/users` - Create a user

### XSS Demonstration
- `POST /api/submit-secure` - Sanitized endpoint (protected against XSS)
- `POST /api/submit-insecure` - Vulnerable endpoint (for demonstration only)
- `GET /api/submissions` - Compare secure vs insecure submissions
- `GET /xss-demo` - Interactive HTML demo page

## 🧪 Testing the Security Features

### 1. Testing Helmet Headers
```bash
curl -I http://localhost:3000/api/security-info
```
You should see various security headers in the response.

### 2. Testing XSS Protection
Secure endpoint:
```bash
curl -X POST http://localhost:3000/api/submit-secure \
  -H "Content-Type: application/json" \
  -d '{"message":"<script>alert(\"XSS\")</script>"}'
```

Insecure endpoint (for comparison):
```bash
curl -X POST http://localhost:3000/api/submit-insecure \
  -H "Content-Type: application/json" \
  -d '{"message":"<script>alert(\"XSS\")</script>"}'
```

### 3. Testing Rate Limiting
Make 4 requests quickly to any endpoint:
```bash
for i in {1..4}; do
  curl http://localhost:3000/api/users
  echo "Request $i completed"
done
```
The 4th request should be rate-limited with a 429 status code.

### 4. Interactive XSS Demo
Visit `http://localhost:3000/xss-demo` in your browser to see the XSS demonstration in action.

## 🎯 Learning Objectives

After working with this project, students should understand:

1. **Why security headers matter** and how they protect against different attack vectors
2. **How CORS works** and when to use it appropriately
3. **What XSS attacks are** and multiple methods to prevent them
4. **How rate limiting protects** against DoS attacks and resource abuse
5. **The importance of input validation** and output encoding

## 🔍 Code Structure

```
├── app.js                    # Main application file
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── node_modules/             # Installed packages
```

## 🚨 Common Vulnerabilities Demonstrated

1. **Missing Security Headers**: Without helmet, the app is vulnerable to various attacks
2. **XSS Attacks**: The `/api/submit-insecure` endpoint demonstrates how XSS can occur
3. **No Rate Limiting**: Without rate limiting, the API can be overwhelmed with requests
4. **Improper CORS**: Allowing all origins can lead to security vulnerabilities

## 💡 Best Practices

1. **Always use Helmet** in production applications
2. **Be specific with CORS** - never allow all origins in production
3. **Sanitize all user input** - never trust user data
4. **Implement rate limiting** on all public-facing APIs
5. **Keep dependencies updated** - regularly check for security updates
6. **Use HTTPS** in production (enforced by Helmet's HSTS header)

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## ⚠️ Important Notes

- This application is for **educational purposes only**
- The insecure endpoints demonstrate vulnerabilities intentionally
- **Never deploy the insecure endpoints to production**
- Always keep security packages updated
- Test your security measures regularly

## 🤝 Contributing

Students are encouraged to:
1. Add more security demonstrations
2. Implement additional middleware
3. Create more comprehensive tests
4. Update deprecated packages with modern alternatives

## License

This project is licensed under the MIT License - see the LICENSE file for details.