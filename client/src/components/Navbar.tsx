import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { navbarStyles } from '../styles/Navbar.styles';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount, openCart } = useCart();
  const navigate = useNavigate();
  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={navbarStyles.nav}>
      <div className={navbarStyles.container}>
        <div className={navbarStyles.flexContainer}>
          <Link to="/" className={navbarStyles.logo}>
            🐾 Pawfect Pets
          </Link>

          <div className={navbarStyles.navLinks}>
            <Link
              to="/"
              className={navbarStyles.navLink}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={navbarStyles.navLink}
            >
              Shop
            </Link>
            <Link
              to="/services"
              className={navbarStyles.navLink}
            >
              Services
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={navbarStyles.navLink}
              >
                Dashboard
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={navbarStyles.navLink}
              >
                Admin
              </Link>
            )}

            <button
              onClick={openCart}
              className={navbarStyles.cartButton}
              type="button"
            >
              {/* Updated cart trigger to open shared drawer instead of navigating away. */}
              🛒 Cart
              {cartCount > 0 && (
                <span className={navbarStyles.cartBadge}>
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className={navbarStyles.userSection}>
                <span className={navbarStyles.userGreeting}>Hello, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className={navbarStyles.logoutButton}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className={navbarStyles.authLinks}>
                <Link
                  to="/login"
                  className={navbarStyles.navLink}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={navbarStyles.signUpButton}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

