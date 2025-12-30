import { useState, useEffect } from 'react';
import { getOrders } from '../utils/api';
import { Order } from '../types';
import { handleApiError } from '../utils/errorHandler';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrders();
        setOrders(response.data);
      } catch (err) {
        handleApiError(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: () => {} };
};

