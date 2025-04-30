const express = require('express');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

router.get('/profile', (req, res) => {

  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Dashboard data',
    user: req.user,
  });
});

module.exports = router;