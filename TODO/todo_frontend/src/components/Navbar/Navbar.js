import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getInitials = () => {
        if (!user?.name) return '?';
        return user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Todo App</h1>
            </div>

            <div className="navbar-user">
                <Link to="/profile" className="user-info">
                    <div className="user-avatar">
                        {getInitials()}
                    </div>
                    <span className="user-name">{user?.name}</span>
                </Link>

                <Link to="/profile" className="nav-btn profile-btn">
                    Profile
                </Link>

                <button onClick={handleLogout} className="nav-btn logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
