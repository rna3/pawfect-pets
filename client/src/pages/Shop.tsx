import { useEffect, useState } from 'react';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { shopStyles } from '../styles/Shop.styles';
import { commonStyles } from '../styles/common';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { items, openCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === categoryFilter));
    }
  }, [categoryFilter, products]);

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  return (
    <div className={shopStyles.container}>
      <h1 className={shopStyles.title}>Shop</h1>

      {/* Category Filter */}
      <div className={shopStyles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={shopStyles.categoryButton(categoryFilter === category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Cart Button */}
      <div className={shopStyles.cartButtonContainer}>
        <button
          onClick={() => {
            if (!user) {
              toast.info('Login to access checkout features.');
            }
            // Trigger global cart drawer shared with the navbar.
            openCart();
          }}
          className={shopStyles.cartButton}
        >
          <span>🛒 Cart ({items.length})</span>
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className={commonStyles.textLoading}>Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className={commonStyles.textEmpty}>No products found</div>
      ) : (
        <div className={shopStyles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;

