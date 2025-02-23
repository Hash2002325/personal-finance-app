const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxLength: [75, 'Title cannot exceed 75 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Please specify an amount'],
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: 'Amount must be greater than zero'
        }
    },
    type: {
        type: String,
        default: "expense",
        enum: ["expense"]
    },
    date: {
        type: Date,
        required: [true, 'Please specify a date'],
        default: Date.now
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        trim: true,
        enum: [
            'Food',
            'Transport',
            'Housing',
            'Entertainment',
            'Health',
            'Education',
            'Shopping',
            'Other'
        ]
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxLength: [150, 'Description cannot exceed 150 characters'],
        trim: true
    },
    paymentMethod: {
        type: String,
        required: false,
        enum: [
            'Cash',
            'Credit Card',
            'Debit Card',
            'Bank Transfer',
            'PayPal',
            'Other'
        ]
    },
    location: {
        type: String,
        required: false,
        trim: true,
        maxLength: [100, 'Location cannot exceed 100 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        default: 'paid',
        enum: ['pending', 'paid', 'cancelled']
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'transactions'
});

ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Expense', ExpenseSchema);