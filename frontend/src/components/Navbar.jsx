import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">Portfolify</div>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/">Dashboard</Link>
                        <span>Welcome, {user.name}</span>
                        <ThemeToggle />
                        <button className="secondary" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <ThemeToggle />
                        <Link to="/login">Login</Link>
                        <Link to="/register"><button>Sign Up</button></Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
