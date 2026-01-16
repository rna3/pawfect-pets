import { useState, useEffect } from 'react';
import { getBookings } from '../utils/api';
import { Booking } from '../types';
import { handleApiError } from '../utils/errorHandler';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBookings();
        setBookings(response.data);
      } catch (err) {
        handleApiError(err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, setBookings, loading, error, refetch: () => {} };
};


