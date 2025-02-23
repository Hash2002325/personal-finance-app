const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { handleError } = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Disable helmet's Content Security Policy for development
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1', require('./routes/transactions'));

// Error handler middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});