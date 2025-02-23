import { useState } from 'react'
import './CategorySelector.css'

const categories = {
  expense: [
    { 
      type: 'expense',
      name: 'Food',
      icon: '🍔',
      color: '#FF6B6B'
    },
    {
      type: 'expense',
      name: 'Transport',
      icon: '🚕',
      color: '#4ECDC4'
    },
    {
      type: 'expense',
      name: 'Housing',
      icon: '🏠',
      color: '#FFE66D'
    },
    {
      type: 'expense',
      name: 'Entertainment',
      icon: '🎮',
      color: '#FF9F1C'
    },
    {
      type: 'expense',
      name: 'Shopping',
      icon: '🛍️',
      color: '#FF6B6B'
    },
    {
      type: 'expense',
      name: 'Other',
      icon: '📝',
      color: '#95A5A6'
    }
  ],
  income: [
    {
      type: 'income',
      name: 'Salary',
      icon: '💰',
      color: '#6BFFB8'
    },
    {
      type: 'income',
      name: 'Investment',
      icon: '📈',
      color: '#6B83FF'
    },
    {
      type: 'income',
      name: 'Freelance',
      icon: '💻',
      color: '#45B7D1'
    },
    {
      type: 'income',
      name: 'Other',
      icon: '📝',
      color: '#95A5A6'
    }
  ]
}

function CategorySelector({ onSelect, selectedCategory, type = 'expense' }) {
  const currentCategories = categories[type] || categories.expense;

  return (
    <div className="category-selector">
      <h3>Select Category</h3>
      <div className="category-grid">
        {currentCategories.map(category => (
          <div
            key={category.name}
            className={`category-card ${
              selectedCategory?.name === category.name ? 'selected' : ''
            }`}
            onClick={() => onSelect(category)}
            style={{ backgroundColor: category.color }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySelector 