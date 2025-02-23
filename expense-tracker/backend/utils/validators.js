const { check } = require('express-validator');

const commonValidators = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 75 })
        .withMessage('Title cannot exceed 75 characters'),
    
    check('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    
    check('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    
    check('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 150 })
        .withMessage('Description cannot exceed 150 characters')
];

exports.expenseValidators = [
    ...commonValidators,
    check('paymentMethod')
        .optional()
        .isIn(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Other'])
        .withMessage('Invalid payment method'),
    
    check('status')
        .optional()
        .isIn(['pending', 'paid', 'cancelled'])
        .withMessage('Invalid status')
];

exports.incomeValidators = [
    ...commonValidators,
    check('source')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Source cannot exceed 100 characters'),
    
    check('paymentType')
        .optional()
        .isIn(['Cash', 'Bank Transfer', 'PayPal', 'Check', 'Direct Deposit', 'Other'])
        .withMessage('Invalid payment type')
];