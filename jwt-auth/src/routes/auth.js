const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Assuming this path is correct
const { generateToken } = require('../config/jwt'); // Assuming this path is correct

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication, registration, and login
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated MongoDB ID of the user.
 *           readOnly: true
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (must be unique).
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (at least 6 characters recommended). Only used for registration, not returned.
 *           writeOnly: true
 *         name:
 *           type: string
 *           description: User's full name.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created.
 *           readOnly: true
 *       example:
 *         id: "60c72b2f9b1e8c001c8e4d8e"
 *         email: "user@example.com"
 *         name: "John Doe"
 *         createdAt: "2023-01-01T12:00:00.000Z"
 *     
 *     UserRegistrationInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: "jane.doe@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: User's desired password.
 *           example: "SecureP@ss123"
 *         name:
 *           type: string
 *           description: User's full name.
 *           example: "Jane Doe"
 *     
 *     UserRegistrationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User registered successfully"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "60c72b2f9b1e8c001c8e4d8e"
 *             email:
 *               type: string
 *               format: email
 *               example: "jane.doe@example.com"
 *             name:
 *               type: string
 *               example: "Jane Doe"
 *     
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's registered email address.
 *           example: "jane.doe@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: User's password.
 *           example: "SecureP@ss123"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           description: JWT token for authenticated access.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGM3MmIyZjliMWU4YzAwMWM4ZTRkOGUiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNjIzMDEzNTk5LCJleHAiOjE2MjMwMTcxOTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "60c72b2f9b1e8c001c8e4d8e"
 *             email:
 *               type: string
 *               format: email
 *               example: "jane.doe@example.com"
 *             name:
 *               type: string
 *               example: "Jane Doe"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message describing the error.
 *       example:
 *         message: "User already exists"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistrationInput'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRegistrationResponse'
 *       400:
 *         description: Bad request (e.g., user already exists, missing fields).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during registration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *         example:
 *           message: "Server error during registration"
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      name
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *         example:
 *           message: "Invalid credentials"
 *       500:
 *         description: Server error during login.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *         example:
 *           message: "Server error during login"
 */

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name
    };

    const token = generateToken(payload);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;