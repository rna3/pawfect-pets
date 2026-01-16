import { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { Product } from '../types';
import { handleApiError } from '../utils/errorHandler';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        const errorMessage = 'Failed to load products';
        handleApiError(err, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, refetch: () => {} };
};


