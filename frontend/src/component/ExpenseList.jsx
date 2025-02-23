import { formatCurrency } from '../utils/currencyFormatter';

function ExpenseList({ expenses, onDeleteExpense }) {
  // Filter expenses to only show current user's transactions
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currency = currentUser?.currency || 'LKR';
  
  const userExpenses = expenses.filter(expense => 
    expense.user === currentUser.id && expense.type === 'expense'
  );

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      {userExpenses.length === 0 ? (
        <p>No expenses added yet</p>
      ) : (
        <ul>
          {userExpenses.map(expense => (
            <li key={expense._id} className="expense-item">
              <div className="expense-info">
                <span className="description">{expense.description}</span>
                <span className="amount">
                  {formatCurrency(expense.amount, currency)}
                </span>
                <span className="date">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={() => onDeleteExpense(expense._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;