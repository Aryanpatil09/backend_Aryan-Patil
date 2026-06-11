const express = require('express');
const router = express.Router();

// Placeholder route for users to prevent application crash
router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Users route is working' });
});

module.exports = router;