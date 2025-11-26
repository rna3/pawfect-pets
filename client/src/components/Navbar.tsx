import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-primary-200">
            🐾 Pawfect Pets
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-primary-200 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="hover:text-primary-200 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/services"
              className="hover:text-primary-200 transition-colors"
            >
              Services
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="hover:text-primary-200 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hover:text-primary-200 transition-colors"
              >
                Admin
              </Link>
            )}

            <button
              onClick={openCart}
              className="relative hover:text-primary-200 transition-colors text-white"
              type="button"
            >
              {/* Updated cart trigger to open shared drawer instead of navigating away. */}
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hello, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-primary-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors"
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

