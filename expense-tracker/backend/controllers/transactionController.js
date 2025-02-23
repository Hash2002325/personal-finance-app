const Transaction = require('../models/TransactionModel');
const { ErrorHandler } = require('../utils/errorHandler');

// Get user's expenses
exports.getExpenses = async (req, res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const expenses = await Transaction.find({
            user: req.user._id.toString(), // Ensure proper ID format
            type: 'expense'
        }).sort({ date: -1 });

        console.log(`Found ${expenses.length} expenses for user: ${req.user._id}`);

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get user's incomes
exports.getIncomes = async (req, res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const incomes = await Transaction.find({
            user: req.user._id.toString(), // Ensure proper ID format
            type: 'income'
        }).sort({ date: -1 });

        console.log(`Found ${incomes.length} incomes for user: ${req.user._id}`);

        res.status(200).json({
            success: true,
            count: incomes.length,
            data: incomes
        });
    } catch (err) {
        console.error('Error fetching incomes:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Create transaction
exports.createTransaction = async (req, res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const transactionData = {
            ...req.body,
            user: req.user._id.toString() // Ensure proper ID format
        };

        console.log('Creating transaction with data:', transactionData);

        const transaction = await Transaction.create(transactionData);

        console.log(`Created transaction for user: ${req.user._id}`, transaction);

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id.toString() // Ensure proper ID format
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found or unauthorized'
            });
        }

        console.log(`Deleted transaction ${req.params.id} for user: ${req.user._id}`);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}; 