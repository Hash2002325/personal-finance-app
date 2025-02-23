const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../utils/errorHandler');

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorHandler(errors.array()[0].msg, 400));
    }
    next();
};