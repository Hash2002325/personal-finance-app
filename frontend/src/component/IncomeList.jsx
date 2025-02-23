import { formatCurrency } from '../utils/currencyFormatter';

function IncomeList({ incomes, onDeleteIncome }) {
  // Filter incomes to only show current user's transactions
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currency = currentUser?.currency || 'LKR';
  
  const userIncomes = incomes.filter(income => 
    income.user === currentUser.id && income.type === 'income'
  );

  return (
    <div className="income-list">
      <h2>Incomes</h2>
      {userIncomes.length === 0 ? (
        <p>No incomes added yet</p>
      ) : (
        <ul>
          {userIncomes.map(income => (
            <li key={income._id} className="income-item">
              <div className="income-info">
                <span className="description">{income.description}</span>
                <span className="amount">
                  {formatCurrency(income.amount, currency)}
                </span>
                <span className="date">
                  {new Date(income.date).toLocaleDateString()}
                </span>
                {income.source && <span className="source">({income.source})</span>}
              </div>
              <button 
                onClick={() => onDeleteIncome(income._id)}
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

export default IncomeList; 