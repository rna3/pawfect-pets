import { commonStyles } from './common';

export const productCardStyles = {
  card: commonStyles.card,
  image: 'w-full h-48 object-cover',
  content: commonStyles.cardContent,
  title: 'text-xl font-semibold mb-2',
  description: 'text-gray-600 text-sm mb-4 line-clamp-2',
  priceContainer: 'flex items-center justify-between',
  price: 'text-2xl font-bold text-primary-600',
  buttonContainer: 'px-4 py-2 rounded transition-colors',
  buttonActive: 'bg-primary-600 text-white hover:bg-primary-700',
  buttonDisabled: commonStyles.buttonDisabled,
  stockInfo: 'text-sm text-gray-500 mt-2',
};


