import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './Report.css';
import { formatCurrency } from '../utils/currencyFormatter';

function Report({ expenses = [], incomes = [] }) {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  
  // Filter transactions by current user
  const userExpenses = expenses.filter(expense => 
    expense.user === currentUser.id
  );
  const userIncomes = incomes.filter(income => 
    income.user === currentUser.id
  );

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenses',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Incomes',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    if (!userExpenses || !userIncomes) return;

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthlyExpenses = userExpenses.filter(expense => 
        expense.type === 'expense' && 
        new Date(expense.date).getMonth() === currentMonth && 
        new Date(expense.date).getFullYear() === currentYear
      );

      const monthlyIncomes = userIncomes.filter(income => 
        income.type === 'income' && 
        new Date(income.date).getMonth() === currentMonth && 
        new Date(income.date).getFullYear() === currentYear
      );

      const categories = [...new Set([
        ...monthlyExpenses.map(exp => exp.category || 'Uncategorized'),
        ...monthlyIncomes.map(inc => inc.category || 'Uncategorized')
      ])];

      const expenseData = categories.map(category => 
        monthlyExpenses
          .filter(exp => (exp.category || 'Uncategorized') === category)
          .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0)
      );

      const incomeData = categories.map(category => 
        monthlyIncomes
          .filter(inc => (inc.category || 'Uncategorized') === category)
          .reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0)
      );

      setChartData({
        labels: categories,
        datasets: [
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Incomes',
            data: incomeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      });
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }, [userExpenses, userIncomes]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value, currentUser.currency);
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `${context.dataset.label}: ${formatCurrency(value, currentUser.currency)}`;
          }
        }
      }
    }
  };

  return (
    <div className="report-container">
      <h2>Monthly Report</h2>
      <div className="chart-container">
        {chartData.labels.length > 0 ? (
          <Bar
            data={chartData}
            options={options}
          />
        ) : (
          <p>No data available for the current month</p>
        )}
      </div>
    </div>
  );
}

export default Report; 