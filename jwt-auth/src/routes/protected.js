const express = require('express');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Protected
 *   description: Protected routes requiring JWT authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Protected route accessed successfully"
 *         user:
 *           type: object
 *           properties:
 *             userId:
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
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Dashboard data"
 *         user:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               example: "60c72b2f9b1e8c001c8e4d8e"
 *             email:
 *               type: string
 *               format: email
 *               example: "jane.doe@example.com"
 *             name:
 *               type: string
 *               example: "Jane Doe"
 */

router.use(authenticateUser);

/**
 * @swagger
 * /api/protected/profile:
 *   get:
 *     summary: Get user profile information
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No token provided"
 *       403:
 *         description: Forbidden - Token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Invalid token"
 */
router.get('/profile', (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

/**
 * @swagger
 * /api/protected/dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No token provided"
 *       403:
 *         description: Forbidden - Token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Invalid token"
 */
router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Dashboard data',
    user: req.user,
  });
});

module.exports = router;