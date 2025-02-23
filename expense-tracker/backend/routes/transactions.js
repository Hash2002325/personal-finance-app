const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats
} = require('../controllers/expenseController');

const {
    getIncomes,
    getIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    getIncomeStats
} = require('../controllers/incomeController');

const { validateRequest } = require('../middleware/validate');
const { expenseValidators, incomeValidators } = require('../utils/validators');
const {
    createTransaction,
    deleteTransaction
} = require('../controllers/transactionController');

// Protected routes
router.use(protect);

// Expense routes
router.route('/expenses')
    .get(getExpenses)
    .post((req, res, next) => {
        req.body.type = 'expense';
        createTransaction(req, res, next);
    });

router.route('/expenses/:id')
    .get(getExpense)
    .put(expenseValidators, validateRequest, updateExpense)
    .delete(deleteTransaction);

router.get('/expenses/stats', getExpenseStats);

// Income routes
router.route('/incomes')
    .get(getIncomes)
    .post((req, res, next) => {
        req.body.type = 'income';
        createTransaction(req, res, next);
    });

router.route('/incomes/:id')
    .get(getIncome)
    .put(incomeValidators, validateRequest, updateIncome)
    .delete(deleteTransaction);

router.get('/incomes/stats', getIncomeStats);

module.exports = router;