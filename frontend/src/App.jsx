import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import ExpenseForm from './component/ExpenseForm'
import IncomeForm from './component/IncomeForm'
import ExpenseList from './component/ExpenseList'
import IncomeList from './component/IncomeList'
import Dashboard from './component/Dashboard'
import CategorySelector from './component/CategorySelector'
import Report from './component/Report'
import Login from './component/auth/Login'
import Register from './component/auth/Register'
import Profile from './component/profile/Profile'
import Navbar from './component/navigation/Navbar'
import ProtectedRoute from './component/auth/ProtectedRoute'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [showForm, setShowForm] = useState('expense')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for logged in user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Fetch expenses and incomes when user is logged in
  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  // Remove or comment out theme initialization
  /*
  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  */

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const [expensesRes, incomesRes] = await Promise.all([
        fetch(`${API_URL}/expenses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_URL}/incomes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      if (!expensesRes.ok || !incomesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const expensesData = await expensesRes.json()
      const incomesData = await incomesRes.json()

      setExpenses(expensesData.data || [])
      setIncomes(incomesData.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setExpenses([])
    setIncomes([])
  }

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const addExpense = async (expense) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: expense.description,
          description: expense.description,
          amount: Number(expense.amount),
          date: expense.date,
          category: expense.category || selectedCategory?.name || 'Other',
          type: 'expense'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add expense')
      }

      const newExpense = await response.json()
      setExpenses([newExpense.data, ...expenses])
      setError(null)
    } catch (err) {
      console.error('Error adding expense:', err)
      setError(err.message || 'Failed to add expense')
    }
  }

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      setExpenses(expenses.filter(expense => expense._id !== id))
      setError(null)
    } catch (err) {
      console.error('Error deleting expense:', err)
      setError('Failed to delete expense')
    }
  }

  const addIncome = async (income) => {
    try {
      const response = await fetch(`${API_URL}/incomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: income.description,
          description: income.description,
          amount: Number(income.amount),
          date: income.date,
          category: income.category || selectedCategory?.name || 'Other',
          type: 'income'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add income')
      }

      const newIncome = await response.json()
      setIncomes([newIncome.data, ...incomes])
      setError(null)
    } catch (err) {
      console.error('Error adding income:', err)
      setError(err.message || 'Failed to add income')
    }
  }

  const deleteIncome = async (id) => {
    try {
      const response = await fetch(`${API_URL}/incomes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete income')
      }

      setIncomes(incomes.filter(income => income._id !== id))
      setError(null)
    } catch (err) {
      console.error('Error deleting income:', err)
      setError('Failed to delete income')
    }
  }

  const getMonthlySummary = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Filter transactions by current user and type
      const userExpenses = expenses.filter(expense => 
        expense.user === currentUser.id && expense.type === 'expense'
      );
      const userIncomes = incomes.filter(income => 
        income.user === currentUser.id && income.type === 'income'
      );

      const monthlyExpenses = userExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      });

      const monthlyIncomes = userIncomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth && 
               incomeDate.getFullYear() === currentYear;
      });

      const totalExpenses = monthlyExpenses.reduce((sum, exp) => {
        const amount = Math.round(parseFloat(exp.amount) * 100) / 100;
        return sum + amount;
      }, 0);

      const totalIncomes = monthlyIncomes.reduce((sum, inc) => {
        const amount = Math.round(parseFloat(inc.amount) * 100) / 100;
        return sum + amount;
      }, 0);

      return {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        totalIncomes: Math.round(totalIncomes * 100) / 100,
        balance: Math.round((totalIncomes - totalExpenses) * 100) / 100
      };
    } catch (err) {
      console.error('Error calculating summary:', err);
      return {
        totalExpenses: 0,
        totalIncomes: 0,
        balance: 0
      };
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" replace /> : <Register onLogin={handleLogin} />
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user} onUpdateProfile={handleUpdateProfile} />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <div className="container">
                <Dashboard summary={getMonthlySummary()} />
                
                <div className="form-selector">
                  <button 
                    className={showForm === 'expense' ? 'active' : ''}
                    onClick={() => setShowForm('expense')}
                  >
                    Add Expense
                  </button>
                  <button 
                    className={showForm === 'income' ? 'active' : ''}
                    onClick={() => setShowForm('income')}
                  >
                    Add Income
                  </button>
                </div>

                <CategorySelector 
                  onSelect={setSelectedCategory} 
                  selectedCategory={selectedCategory}
                  type={showForm}
                />

                {showForm === 'expense' ? (
                  <ExpenseForm 
                    onAddExpense={addExpense} 
                    selectedCategory={selectedCategory}
                  />
                ) : (
                  <IncomeForm 
                    onAddIncome={addIncome} 
                    selectedCategory={selectedCategory}
                  />
                )}

                <Report expenses={expenses} incomes={incomes} />

                <div className="lists-container">
                  <ExpenseList 
                    expenses={expenses} 
                    onDeleteExpense={deleteExpense} 
                  />
                  <IncomeList 
                    incomes={incomes} 
                    onDeleteIncome={deleteIncome} 
                  />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App