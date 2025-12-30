// Date utility functions

/**
 * Converts a date string to ISO format for date input fields (YYYY-MM-DD)
 */
export const toInputDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gets today's date in ISO format (YYYY-MM-DD) for date input min attribute
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Checks if a date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

/**
 * Checks if end date is after start date
 */
export const isEndDateAfterStart = (startDate: string, endDate: string): boolean => {
  return new Date(endDate) > new Date(startDate);
};

/**
 * Formats duration in minutes to a readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours}h ${mins}m`;
};

