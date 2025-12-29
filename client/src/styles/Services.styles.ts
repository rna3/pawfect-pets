import { commonStyles } from './common';

export const servicesStyles = {
  container: commonStyles.containerWithPadding,
  title: commonStyles.heading1,
  categoryFilter: 'mb-6 flex flex-wrap gap-2',
  categoryButton: (isActive: boolean) => 
    `${commonStyles.categoryButton} ${isActive ? commonStyles.categoryButtonActive : commonStyles.categoryButtonInactive}`,
  servicesGrid: commonStyles.gridServices,
  modalOverlay: commonStyles.modalOverlay,
  modalContent: commonStyles.modalContent,
  modalTitle: 'text-2xl font-bold mb-4',
  formField: 'space-y-4',
  label: 'block text-sm font-medium mb-1',
  input: commonStyles.input,
  textarea: 'w-full px-4 py-2 border rounded',
  buttonGroup: 'flex space-x-4',
  cancelButton: commonStyles.buttonCancel,
  submitButton: 'flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400',
};

