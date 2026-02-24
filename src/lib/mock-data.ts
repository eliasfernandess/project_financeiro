import { Category, Transaction, Goal } from './types';

export const mockCategories: Category[] = [
    { id: '1', name: 'Salário', icon: 'Briefcase', color: '#22c55e', type: 'income' },
    { id: '2', name: 'Freelance', icon: 'Laptop', color: '#3b82f6', type: 'income' },
    { id: '3', name: 'Investimentos', icon: 'TrendingUp', color: '#8b5cf6', type: 'income' },
    { id: '4', name: 'Alimentação', icon: 'UtensilsCrossed', color: '#ef4444', type: 'expense' },
    { id: '5', name: 'Transporte', icon: 'Car', color: '#f97316', type: 'expense' },
    { id: '6', name: 'Moradia', icon: 'Home', color: '#ec4899', type: 'expense' },
    { id: '7', name: 'Saúde', icon: 'Heart', color: '#14b8a6', type: 'expense' },
    { id: '8', name: 'Educação', icon: 'GraduationCap', color: '#6366f1', type: 'expense' },
    { id: '9', name: 'Lazer', icon: 'Gamepad2', color: '#eab308', type: 'expense' },
    { id: '10', name: 'Outros', icon: 'MoreHorizontal', color: '#64748b', type: 'expense' },
];

export const mockTransactions: Transaction[] = [];

export const mockGoals: Goal[] = [];

export const availableIcons = [
    'Briefcase', 'Laptop', 'TrendingUp', 'UtensilsCrossed', 'Car', 'Home',
    'Heart', 'GraduationCap', 'Gamepad2', 'MoreHorizontal', 'ShoppingCart',
    'Smartphone', 'Plane', 'Music', 'Book', 'Coffee', 'Gift', 'Zap',
    'Shirt', 'Dumbbell', 'Dog', 'Baby', 'Wrench', 'Wifi', 'CreditCard',
    'Banknote', 'PiggyBank', 'Tag', 'Star', 'Trophy',
];

export const categoryColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b',
    '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0d9488',
    '#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#475569',
];
