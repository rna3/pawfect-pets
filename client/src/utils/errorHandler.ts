// Centralized error handling utilities

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

/**
 * Extracts error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Handles API errors and shows toast notification
 */
export const handleApiError = (error: unknown, defaultMessage?: string): void => {
  const message = defaultMessage || getErrorMessage(error);
  toast.error(message);
  console.error('API Error:', error);
};

/**
 * Handles API success and shows toast notification
 */
export const handleApiSuccess = (message: string): void => {
  toast.success(message);
};


