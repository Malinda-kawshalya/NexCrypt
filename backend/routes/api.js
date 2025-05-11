const express = require('express');
const router = express.Router();
const SignatureController = require('../controllers/signatureController');

const signatureController = new SignatureController();

// Route to create a signature
router.post('/sign', signatureController.createSignature.bind(signatureController));

// Route to verify a signature
router.post('/verify', signatureController.verifySignature.bind(signatureController));

module.exports = router;