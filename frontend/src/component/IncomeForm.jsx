import { useState } from 'react'

function IncomeForm({ onAddIncome, selectedCategory }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'income'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.date) return
    
    // Convert amount to number while preserving precision
    const amount = Math.round(parseFloat(formData.amount) * 100) / 100;
    
    onAddIncome({
      ...formData,
      amount: amount,
      category: selectedCategory?.name || 'Other',
      title: formData.description
    })

    setFormData({
      title: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      type: 'income'
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'amount') {
      // Allow only numbers and one decimal point
      const numericValue = value.replace(/[^\d.]/g, '')
      const parts = numericValue.split('.')
      
      // Ensure only one decimal point and max 2 decimal places
      let formattedValue = parts[0]
      if (parts.length > 1) {
        formattedValue += '.' + parts[1].slice(0, 2)
      }
      
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedValue
      }))
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="income-form">
      <div className="form-group">
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
          pattern="^\d*\.?\d{0,2}$"
          title="Enter a valid amount with up to 2 decimal places"
        />
      </div>
      <div className="form-group">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Income</button>
    </form>
  )
}

export default IncomeForm 