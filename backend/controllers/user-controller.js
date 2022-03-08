const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');
const HttpError = require('../models/http-error');


const getUserById = async (req, res, next) => {
    let userId = req.params.uid;
    let user
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        let error = new HttpError('Fetching user failed', 500);
        return next(error);
    }

    if (!user) {
        throw new HttpError('Could not find user with a providen id', 404);
    }

    res.json({ user });
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        let error = new HttpError('loggin in failed, please try again', 500);
        return next(error);
    }

    if (!existingUser) {
        let error = new HttpError('user credentials were passed wrong, try again', 500)
        return next(error);
    }

    let isValidPass = false;
    try {
        isValidPass = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        let error = new HttpError('wrong credentials were passed in, try again', 500)
        return next(error);
    }

    if (!isValidPass) {
        let error = new HttpError('wrong credentials were passed in, try again', 401)
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'secret_key_for_jwt',
            { expiresIn: '1h' }
        );
    } catch (err) {
        let error = new HttpError('logging in failed, please try again', 500);
        return next(error);
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token });
}

const signup = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = new HttpError('Invalid inputs passed, plese check your data', 422);
        return next(error);
    }
    const { username, email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        let error = new HttpError('signing up failed, please try again', 500);
        return next(error);
    }

    if (existingUser) {
        let error = new HttpError('user with this email is already exists', 422);
        return next(error);
    }

    let hashedPass;
    try {
        hashedPass = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user', 500);
        return next(error);
    }

    const createdUser = new User({
        username,
        email,
        image: 'http://localhost:4000/' + req.file.path,
        password: hashedPass,
        parties: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        let error = new HttpError('Creating user failed', 500);
        return next(error);
    };

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'secret_key_for_jwt',
            { expiresIn: '1h' }
        );
    } catch (err) {
        let error = new HttpError('signing up failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
}

exports.getUserById = getUserById;
exports.login = login;
exports.signup = signup;