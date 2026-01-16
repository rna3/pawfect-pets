// Validation utility functions

/**
 * Validates booking form data
 */
export interface BookingValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateBooking = (
  date: string,
  time: string,
  category: string,
  endDate?: string
): BookingValidationResult => {
  if (!date || !time) {
    return { isValid: false, error: 'Please fill in all required fields' };
  }

  if (category === 'boarding') {
    if (!endDate) {
      return { isValid: false, error: 'Boarding services require an end date' };
    }
    if (new Date(endDate) <= new Date(date)) {
      return {
        isValid: false,
        error: 'Boarding services require an end date after the start date.',
      };
    }
  }

  return { isValid: true };
};

/**
 * Validates password confirmation
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


