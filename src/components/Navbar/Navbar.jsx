import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importar estilos CSS normales

function Navbar() {
  return (
    <div className="navbar-container">
      <nav>
        <ul>
          <li>
            <Link to="/">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/about">
              Acerca de
            </Link>
          </li>
          <li className="dropdown">
            <span className="dropdown-title">Posiciones</span>
            <div className="dropdown-content">
              <Link to="/posiciones/pilotos">Pilotos</Link>
              <Link to="/posiciones/constructores">Constructores</Link>
            </div>
          </li>
          <li>
            <Link to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link to="/registro">
              Regístrate
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
