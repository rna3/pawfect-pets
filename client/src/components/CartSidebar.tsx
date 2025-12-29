import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { cartSidebarStyles } from '../styles/CartSidebar.styles';

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
    <div className={cartSidebarStyles.overlay} onClick={closeWithAnimation}>
      <div
        className={cartSidebarStyles.sidebar(animateIn)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cartSidebarStyles.header}>
          <h2 className={cartSidebarStyles.title}>Shopping Cart</h2>
          <button
            onClick={closeWithAnimation}
            className={cartSidebarStyles.closeButton}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Shared drawer pulled out of Shop so navbar matches behavior. */}
        {items.length === 0 ? (
          <p className={cartSidebarStyles.emptyMessage}>Your cart is empty</p>
        ) : (
          <>
            <div className={cartSidebarStyles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={cartSidebarStyles.itemCard}>
                  <img src={item.image} alt={item.name} className={cartSidebarStyles.itemImage} />
                  <div className={cartSidebarStyles.itemDetails}>
                    <h3 className={cartSidebarStyles.itemName}>{item.name}</h3>
                    <p className={cartSidebarStyles.itemPrice}>${item.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div className={cartSidebarStyles.quantityControls}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={cartSidebarStyles.quantityButton}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={cartSidebarStyles.quantityDisplay}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={cartSidebarStyles.quantityButton}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className={cartSidebarStyles.removeButton}
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                  <div className={cartSidebarStyles.itemTotal}>
                    <p className={cartSidebarStyles.itemTotalPrice}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={cartSidebarStyles.summary}>
              <div className={cartSidebarStyles.totalRow}>
                <span>Total:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className={cartSidebarStyles.checkoutButton}
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

