const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/user-controller');
const fileUpload = require('../middlware/file-upload');

const router =  express.Router();

router.get('/user/:uid', userControllers.getUserById);
router.post('/login', userControllers.login);
router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
    ],
    userControllers.signup
);

module.exports = router;