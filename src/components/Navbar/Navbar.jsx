import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        window.location.href = '/';
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="navbar-container">
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/about">Acerca de</Link>
          </li>
          <li className="dropdown">
            <span className="dropdown-title">Standings</span>
            <div className="dropdown-content">
              <Link to="/standings/drivers">Drivers</Link>
              <Link to="/standings/constructors">Teams</Link>
            </div>
          </li>
          <li>
            <Link to="/calendar">Calendar</Link>
          </li>
          <li>
            <Link to="/forum">Forum</Link>
          </li>
          {user ? (
            <li className="user-info">
              {user.avatar && <img src={`http://localhost:3001/${user.avatar}`} alt="Avatar" className="navbar-avatar" />}
              <Link to="/profile" className="navbar-username">{user.username}</Link>
              <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Regístrate</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
