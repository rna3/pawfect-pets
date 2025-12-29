// Common reusable style classes and objects
export const commonStyles = {
  // Container styles
  container: 'container mx-auto px-4',
  containerWithPadding: 'container mx-auto px-4 py-8',
  
  // Button styles
  buttonPrimary: 'bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors',
  buttonPrimaryLarge: 'bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors',
  buttonSecondary: 'bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors',
  buttonWhite: 'bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors',
  buttonHeroWhite: 'bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors',
  buttonHeroPrimary: 'bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors',
  buttonDisabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  buttonDanger: 'bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600',
  buttonEdit: 'bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600',
  buttonCancel: 'px-4 py-2 border rounded hover:bg-gray-100',
  
  // Input styles
  input: 'w-full px-4 py-2 border rounded',
  inputFocus: 'w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500',
  
  // Card styles
  card: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow',
  cardContent: 'p-4',
  
  // Grid styles
  gridProducts: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  gridProductsShop: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  gridServices: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  gridDashboard: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  
  // Text styles
  heading1: 'text-4xl font-bold mb-8',
  heading2: 'text-3xl font-bold text-center mb-8',
  heading3: 'text-2xl font-bold mb-4',
  textCenter: 'text-center',
  textLoading: 'text-center',
  textEmpty: 'text-center text-gray-500',
  
  // Link styles
  linkPrimary: 'text-primary-600 hover:text-primary-700 font-semibold',
  linkNav: 'hover:text-primary-200 transition-colors',
  
  // Modal/Overlay styles
  modalOverlay: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center',
  modalContent: 'bg-white rounded-lg p-6 max-w-md w-full mx-4',
  modalContentLarge: 'bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl',
  
  // Status badges
  statusConfirmed: 'bg-green-100 text-green-800',
  statusPending: 'bg-yellow-100 text-yellow-800',
  statusCompleted: 'bg-green-100 text-green-800',
  
  // Category filter button
  categoryButtonActive: 'bg-primary-600 text-white',
  categoryButtonInactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  categoryButton: 'px-4 py-2 rounded transition-colors',
};

// Inline style objects for dynamic styles
export const inlineStyles = {
  heroBackground: (imageUrl: string) => ({
    backgroundImage: `url(${imageUrl})`,
  }),
};

