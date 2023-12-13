const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { checkSchema } = require('express-validator');
const { checkValidity } = require('../middleware/validator');
const userRegister = require('../validations/userRegister');
const userLogin = require('../validations/userLogin');
const authHandler = require('../middleware/authHandler');



router.get('/me', authHandler, authController.me);
router.post('/register', checkSchema(userRegister), checkValidity, authController.register);
router.post('/login', checkSchema(userLogin), checkValidity, authController.login);
router.post('/verify-token', authController.verifyToken);

module.exports = router;
