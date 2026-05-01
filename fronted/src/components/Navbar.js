import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌱 CleanCity</Link>
      {user ? (
        <div className="navbar-links">
          {user.role === 'citizen' && <>
            <Link to="/reports"     className="nav-link">Reports</Link>
            <Link to="/leaderboard" className="nav-link">🏆 Leaderboard</Link>
            <Link to="/profile"     className="nav-link">My Profile</Link>
          </>}
          {user.role === 'admin' &&
            <Link to="/admin" className="nav-admin-btn">Admin Panel</Link>}
          {user.role === 'driver' &&
            <Link to="/driver" className="nav-link">My Tasks</Link>}
          <span className="nav-badge">⭐ {user.points} pts</span>
          <span className="nav-badge">{user.role}</span>
          <button onClick={handleLogout} className="nav-btn">Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login"    className="nav-link">Login</Link>
          <Link to="/register" className="nav-admin-btn">Register</Link>
        </div>
      )}
    </nav>
  );
}