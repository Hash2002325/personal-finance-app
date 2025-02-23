import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Expense Tracker</Link>
      </div>
      
      {user ? (
        <div className="navbar-user">
          <Link to="/profile" className="profile-link">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="navbar-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
              }}
            />
            <span className="user-name">{user.name}</span>
          </Link>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-auth">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 