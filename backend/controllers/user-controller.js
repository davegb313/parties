const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

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

    if(!user) {
        throw new HttpError('Could not find user with a providen id', 404);
    }

    res.json({user});
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

    if (existingUser || existingUser.password !== password) {
        let error = new HttpError('wrong credentials were passed in, try again', 401)
    }

    res.json({user: existingUser.toObject({ getters: true })});
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
        
    const createdUser = new User({
        username,
        email,
        image: "https://media.istockphoto.com/vectors/user-avatar-profile-icon-black-vector-illustration-vector-id1209654046?k=20&m=1209654046&s=612x612&w=0&h=Atw7VdjWG8KgyST8AXXJdmBkzn0lvgqyWod9vTb2XoE=",
        password,
        parties: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        let error = new HttpError('Creating user failed', 500);
        return next(error);
    };

    res.status(201).json({user: createdUser.toObject({ getters: true })});
}

exports.getUserById = getUserById;
exports.login = login;
exports.signup = signup;