const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true // Add index for user field
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxLength: [50, 'Title cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxLength: [100, 'Description cannot exceed 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: 'Amount must be greater than zero'
        }
    },
    category: {
        type: String,
        required: [true, 'Please provide a category']
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Other'],
        default: 'Other'
    }
}, {
    timestamps: true,
    collection: 'transactions'
});

// Compound indexes for faster queries and filtering
TransactionSchema.index({ user: 1, type: 1, date: -1 });

// Add a pre-find middleware to always check for user
TransactionSchema.pre(/^find/, function(next) {
    if (!this._conditions.user && this.op === 'find') {
        console.warn('Query without user filter detected');
    }
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema); 