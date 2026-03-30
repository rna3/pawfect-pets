import { commonStyles } from './common';

export const servicesStyles = {
  container: commonStyles.containerWithPadding,
  title: commonStyles.heading1,
  categoryFilter: 'mb-6 flex flex-wrap gap-2',
  categoryButton: (isActive: boolean) => 
    `${commonStyles.categoryButton} ${isActive ? commonStyles.categoryButtonActive : commonStyles.categoryButtonInactive}`,
  servicesGrid: commonStyles.gridServices,
  modalOverlay: commonStyles.modalOverlay,
  modalOverlayInner: commonStyles.modalOverlayInner,
  modalContent: commonStyles.modalContent,
  modalTitle: 'text-2xl font-bold mb-4',
  formField: 'space-y-4',
  label: 'block text-sm font-medium mb-1',
  input: commonStyles.input,
  textarea: 'w-full px-4 py-2 border rounded',
  calendarFrame: 'w-full h-80 border rounded',
  calendarFallback: 'w-full p-4 border rounded text-gray-600 bg-gray-50',
  slotGrid: 'grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto',
  slotButton: (selected: boolean) =>
    `px-3 py-2 text-left rounded border transition-colors ${
      selected
        ? 'bg-primary-600 text-white border-primary-600'
        : 'bg-white text-gray-800 border-gray-300 hover:border-primary-400'
    }`,
  availabilityError: 'text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2',
  buttonGroup: 'flex space-x-4',
  cancelButton: commonStyles.buttonCancel,
  submitButton: 'flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400',
};


