import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="theme-navbar">
      <Link to="/products" className="brand-title">LJD CLOTHING STORE INVENTORY SYSTEM</Link>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/products" className="theme-link">Products</Link>
            <Link to="/profile" className="theme-link">Profile</Link>
            <button
              onClick={handleLogout}
              className="theme-logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="theme-link">Login</Link>
            <Link
              to="/register"
              className="theme-register"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;