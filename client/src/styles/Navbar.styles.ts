import { commonStyles } from './common';

export const navbarStyles = {
  nav: 'bg-primary-600 text-white shadow-lg',
  container: 'container mx-auto px-4 py-4',
  flexContainer: 'flex items-center justify-between',
  logo: 'text-2xl font-bold hover:text-primary-200',
  navLinks: 'flex items-center space-x-6',
  navLink: commonStyles.linkNav,
  cartButton: 'relative hover:text-primary-200 transition-colors text-white',
  cartBadge: 'absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center',
  userSection: 'flex items-center space-x-4',
  userGreeting: 'text-sm',
  logoutButton: 'bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors',
  authLinks: 'flex items-center space-x-4',
  signUpButton: 'bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded transition-colors',
};

