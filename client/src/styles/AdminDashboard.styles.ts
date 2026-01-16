import { commonStyles } from './common';

export const adminDashboardStyles = {
  container: commonStyles.containerWithPadding,
  title: commonStyles.heading1,
  tabs: 'flex space-x-4 mb-6',
  tabButton: (isActive: boolean) => 
    `px-4 py-2 rounded ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`,
  sectionHeader: 'flex justify-between items-center mb-4',
  sectionTitle: commonStyles.heading3,
  addButton: 'bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  itemCard: 'bg-white rounded-lg shadow p-4',
  itemImage: 'w-full h-32 object-cover rounded mb-2',
  itemName: 'font-semibold',
  itemPrice: 'text-gray-600 text-sm mb-2',
  itemActions: 'flex space-x-2',
  editButton: commonStyles.buttonEdit,
  deleteButton: commonStyles.buttonDanger,
  modalOverlay: commonStyles.modalOverlay,
  modalContent: commonStyles.modalContent,
  modalTitle: 'text-2xl font-bold mb-4',
  form: 'space-y-4',
  formField: 'block text-sm font-medium mb-1',
  input: commonStyles.input,
  textarea: 'w-full px-4 py-2 border rounded',
  select: 'w-full px-4 py-2 border rounded',
  formButtons: 'flex space-x-4',
  cancelButton: 'flex-1 px-4 py-2 border rounded hover:bg-gray-100',
  saveButton: 'flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700',
};


