const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/errorHandler');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Register user
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log('Register attempt:', { name, email });

        // Check if user exists
        const userExists = await User.findOne({ email });
        console.log('User exists:', userExists);

        if (userExists) {
            return next(new ErrorHandler('Email already registered', 400));
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });
        console.log('User created:', user);

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                currency: user.currency,
                theme: user.theme
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        next(new ErrorHandler(err.message, 500));
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        // Check if email and password are provided
        if (!email || !password) {
            return next(new ErrorHandler('Please provide email and password', 400));
        }

        // Check if user exists and get password
        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return next(new ErrorHandler('Invalid credentials', 401));
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return next(new ErrorHandler('Invalid credentials', 401));
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                currency: user.currency,
                theme: user.theme
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        next(new ErrorHandler('Failed to login', 500));
    }
};

// Get profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

// Logout user
exports.logout = (req, res) => {
    res.status(200).json({
        success: true,
        data: {}
    });
}; 