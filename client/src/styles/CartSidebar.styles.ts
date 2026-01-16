import { commonStyles } from './common';

export const cartSidebarStyles = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200',
  sidebar: (animateIn: boolean) => 
    `fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto transform transition-transform duration-200 ease-out ${
      animateIn ? 'translate-x-0' : 'translate-x-full'
    }`,
  header: 'flex justify-between items-center mb-4',
  title: 'text-2xl font-bold',
  closeButton: 'text-gray-500 hover:text-gray-700',
  emptyMessage: 'text-gray-500',
  itemsList: 'space-y-4 mb-4',
  itemCard: 'flex items-start space-x-4 border-b pb-4',
  itemImage: 'w-16 h-16 object-cover rounded flex-shrink-0',
  itemDetails: 'flex-1 min-w-0',
  itemName: 'font-semibold mb-1',
  itemPrice: 'text-gray-600 mb-2',
  quantityControls: 'flex items-center space-x-2 mb-2',
  quantityButton: 'w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors',
  quantityDisplay: 'w-10 text-center font-medium',
  removeButton: 'text-red-600 hover:text-red-700 text-sm font-medium transition-colors',
  itemTotal: 'flex flex-col items-end flex-shrink-0',
  itemTotalPrice: 'font-bold text-lg',
  summary: 'border-t pt-4',
  totalRow: 'flex justify-between text-xl font-bold mb-4',
  checkoutButton: 'w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-400',
};


