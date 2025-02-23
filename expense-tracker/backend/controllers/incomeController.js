const Income = require('../models/IncomeModel');
const { ErrorHandler } = require('../utils/errorHandler');

// Get all incomes with pagination and filters
exports.getIncomes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Create filter object
        let query = Income.find(queryObj);

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-date');
        }

        // Execute query
        const incomes = await query.skip(skip).limit(limit);
        const total = await Income.countDocuments(queryObj);

        res.status(200).json({
            success: true,
            count: incomes.length,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            },
            data: incomes
        });
    } catch (error) {
        next(new ErrorHandler('Failed to fetch incomes', 500));
    }
};

// Create income
exports.createIncome = async (req, res, next) => {
    try {
        const income = await Income.create(req.body);
        
        res.status(201).json({
            success: true,
            data: income
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return next(new ErrorHandler(messages.join(', '), 400));
        }
        next(new ErrorHandler('Failed to create income', 500));
    }
};

// Get single income
exports.getIncome = async (req, res, next) => {
    try {
        const income = await Income.findById(req.params.id);
        
        if (!income) {
            return next(new ErrorHandler('Income not found', 404));
        }

        res.status(200).json({
            success: true,
            data: income
        });
    } catch (error) {
        next(new ErrorHandler('Failed to fetch income', 500));
    }
};

// Update income
exports.updateIncome = async (req, res, next) => {
    try {
        const income = await Income.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!income) {
            return next(new ErrorHandler('Income not found', 404));
        }

        res.status(200).json({
            success: true,
            data: income
        });
    } catch (error) {
        next(new ErrorHandler('Failed to update income', 500));
    }
};

// Delete income
exports.deleteIncome = async (req, res, next) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);

        if (!income) {
            return next(new ErrorHandler('Income not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(new ErrorHandler('Failed to delete income', 500));
    }
};

// Get income statistics
exports.getIncomeStats = async (req, res, next) => {
    try {
        const stats = await Income.aggregate([
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

        const categoryStats = await Income.aggregate([
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
        next(new ErrorHandler('Failed to get income statistics', 500));
    }
};