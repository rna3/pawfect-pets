import { commonStyles } from './common';

export const loginStyles = {
  container: 'container mx-auto px-4 py-16',
  card: 'max-w-md mx-auto bg-white rounded-lg shadow-lg p-8',
  title: 'text-3xl font-bold text-center mb-8',
  form: 'space-y-6',
  formField: 'block text-sm font-medium mb-2',
  input: commonStyles.inputFocus,
  submitButton: 'w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-400 transition-colors',
  footer: 'mt-6 text-center text-gray-600',
  link: commonStyles.linkPrimary,
};


