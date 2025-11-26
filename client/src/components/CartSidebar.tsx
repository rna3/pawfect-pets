import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CartSidebar = () => {
  const { items, getTotal, clearCart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingOut, setCheckingOut] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!isCartOpen) {
      setAnimateIn(false);
      return;
    }

    // Animate in whenever cart opens so repeated toggles slide correctly.
    const frame = requestAnimationFrame(() => setAnimateIn(true));
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isCartOpen]);

  if (!isCartOpen) {
    return null;
  }

  const closeWithAnimation = () => {
    setAnimateIn(false);
    setTimeout(() => closeCart(), 200);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      closeWithAnimation();
      navigate('/login', { state: { from: location } });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setCheckingOut(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await createOrder(orderItems);
      clearCart();
      toast.success('Order placed successfully!');
      closeWithAnimation();
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200" onClick={closeWithAnimation}>
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto transform transition-transform duration-200 ease-out ${animateIn ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={closeWithAnimation}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Shared drawer pulled out of Shop so navbar matches behavior. */}
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-400"
              >
                {checkingOut ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;

