import { commonStyles } from './common';

export const shopStyles = {
  container: commonStyles.containerWithPadding,
  title: commonStyles.heading1,
  categoryFilter: 'mb-6 flex flex-wrap gap-2',
  categoryButton: (isActive: boolean) => 
    `${commonStyles.categoryButton} ${isActive ? commonStyles.categoryButtonActive : commonStyles.categoryButtonInactive}`,
  cartButtonContainer: 'mb-6 flex justify-end',
  cartButton: 'bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 flex items-center space-x-2',
  productsGrid: commonStyles.gridProductsShop,
};


