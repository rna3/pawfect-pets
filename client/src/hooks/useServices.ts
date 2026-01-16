import { useState, useEffect } from 'react';
import { getServices } from '../utils/api';
import { Service } from '../types';
import { handleApiError } from '../utils/errorHandler';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getServices();
        setServices(response.data);
      } catch (err) {
        const errorMessage = 'Failed to load services';
        handleApiError(err, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error, refetch: () => {} };
};


