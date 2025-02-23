import { formatCurrency } from '../utils/currencyFormatter';
import './Dashboard.css'

function Dashboard({ summary }) {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currency = currentUser?.currency || 'LKR';

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h3>Total Income</h3>
        <p className="income">{formatCurrency(summary.totalIncomes, currency)}</p>
      </div>
      <div className="dashboard-card">
        <h3>Total Expenses</h3>
        <p className="expense">{formatCurrency(summary.totalExpenses, currency)}</p>
      </div>
      <div className="dashboard-card">
        <h3>Balance</h3>
        <p 
          className={summary.balance >= 0 ? 'positive' : 'negative'}
        >
          {formatCurrency(summary.balance, currency)}
        </p>
      </div>
    </div>
  )
}

export default Dashboard 