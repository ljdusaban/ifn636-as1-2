import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const accountRole = user?.role === 'admin' ? 'ADMIN' : 'STAFF';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="theme-navbar">
      <Link to="/products" className="brand-title">LJD CLOTHING STORE INVENTORY SYSTEM</Link>
      <div className="nav-center">
        {user && <div className="role-pill">{accountRole} ACCOUNT</div>}
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <Link 
              to="/products" 
              className={`theme-link ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/profile" 
              className={`theme-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              Profile
            </Link>
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