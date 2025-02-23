const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
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
        default: "income",
        enum: ["income"]
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
            'Salary',
            'Freelance',
            'Investments',
            'Rental',
            'Business',
            'Other'
        ]
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxLength: [150, 'Description cannot exceed 150 characters'],
        trim: true
    },
    source: {
        type: String,
        required: false,
        trim: true,
        maxLength: [100, 'Source cannot exceed 100 characters']
    },
    paymentType: {
        type: String,
        required: false,
        enum: [
            'Cash',
            'Bank Transfer',
            'PayPal',
            'Check',
            'Direct Deposit',
            'Other'
        ]
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        default: 'received',
        enum: ['pending', 'received', 'cancelled']
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'transactions'
});

IncomeSchema.index({ date: -1 });
IncomeSchema.index({ category: 1 });
IncomeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Income', IncomeSchema);