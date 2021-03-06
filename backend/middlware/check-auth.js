const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed');
        }
        const decodedToken = jwt.verify(token, 'secret_key_for_jwt');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        error = new HttpError('Authentication failed', 401)
        return next(error);
    }
}