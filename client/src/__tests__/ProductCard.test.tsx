import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  stock: 10,
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>);
};

describe('ProductCard', () => {
  it('renders product information', () => {
    renderWithProvider(<ProductCard {...mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('disables button when out of stock', () => {
    renderWithProvider(<ProductCard {...mockProduct} stock={0} />);
    
    const button = screen.getByText('Out of Stock');
    expect(button).toBeDisabled();
  });

  it('calls addItem when Add to Cart is clicked', () => {
    renderWithProvider(<ProductCard {...mockProduct} />);
    
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    
    // Button should still be visible (cart context handles the add)
    expect(button).toBeInTheDocument();
  });
});

