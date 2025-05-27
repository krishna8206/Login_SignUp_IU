const express = require('express');
const router = express.Router();
const { sendOTP, sendLoginOTP, verifyOTP } = require('../controllers/auth.controller');

router.post('/send-otp', sendOTP);         // For registration
router.post('/login-otp', sendLoginOTP);   // For login
router.post('/verify-otp', verifyOTP);     // Shared for both flows

module.exports = router;
