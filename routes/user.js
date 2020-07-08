const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

// Register GET request
router.get('/register', userController.getRegister);

// Login submit req
router.post('/login', userController.login);

// Register User
router.post('/register', userController.register);

module.exports = router;


