const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { ErrorHandler } = require('../utils/errorHandler');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ErrorHandler('Not authorized to access this route', 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return next(new ErrorHandler('User not found', 401));
            }

            // Add additional logging
            console.log('Authenticated user:', user._id);
            
            // Attach user to request
            req.user = user;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            return next(new ErrorHandler('Invalid or expired token', 401));
        }
    } catch (err) {
        console.error('Authentication error:', err);
        return next(new ErrorHandler('Authentication failed', 401));
    }
}; 