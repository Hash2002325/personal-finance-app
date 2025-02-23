const Expense = require('../models/ExpenseModel');
const { ErrorHandler } = require('../utils/errorHandler');

// Get all expenses with pagination and filters
exports.getExpenses = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Create filter object
        let query = Expense.find(queryObj);

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-date');
        }

        // Execute query
        const expenses = await query.skip(skip).limit(limit);
        const total = await Expense.countDocuments(queryObj);

        res.status(200).json({
            success: true,
            count: expenses.length,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            },
            data: expenses
        });
    } catch (error) {
        next(new ErrorHandler('Failed to fetch expenses', 500));
    }
};

// Get single expense
exports.getExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        
        if (!expense) {
            return next(new ErrorHandler('Expense not found', 404));
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(new ErrorHandler('Failed to fetch expense', 500));
    }
};

// Create expense
exports.createExpense = async (req, res, next) => {
    try {
        const expense = await Expense.create(req.body);

        console.log('Created Expense:', expense);
        
        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.error('Validation Error:', messages);
            return next(new ErrorHandler(messages.join(', '), 400));
        }
        console.error('Error:', error);
        next(new ErrorHandler('Failed to create expense', 500));
    }
};

// Update expense
exports.updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return next(new ErrorHandler('Expense not found', 404));
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(new ErrorHandler('Failed to update expense', 500));
    }
};

// Delete expense
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return next(new ErrorHandler('Expense not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(new ErrorHandler('Failed to delete expense', 500));
    }
};

// Get expense statistics
exports.getExpenseStats = async (req, res, next) => {
    try {
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    averageAmount: { $avg: '$amount' },
                    minAmount: { $min: '$amount' },
                    maxAmount: { $max: '$amount' },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        const categoryStats = await Expense.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { totalAmount: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overall: stats[0],
                byCategory: categoryStats
            }
        });
    } catch (error) {
        next(new ErrorHandler('Failed to get expense statistics', 500));
    }
};