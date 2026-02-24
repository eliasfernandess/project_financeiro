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

export const mockTransactions: Transaction[] = [
    { id: '1', description: 'Salário Mensal', amount: 8500, type: 'income', category_id: '1', date: '2026-02-01' },
    { id: '2', description: 'Projeto Web', amount: 3200, type: 'income', category_id: '2', date: '2026-02-05' },
    { id: '3', description: 'Dividendos', amount: 450, type: 'income', category_id: '3', date: '2026-02-10' },
    { id: '4', description: 'Supermercado', amount: 850, type: 'expense', category_id: '4', date: '2026-02-03' },
    { id: '5', description: 'Restaurante', amount: 120, type: 'expense', category_id: '4', date: '2026-02-08' },
    { id: '6', description: 'Combustível', amount: 280, type: 'expense', category_id: '5', date: '2026-02-04' },
    { id: '7', description: 'Uber', amount: 95, type: 'expense', category_id: '5', date: '2026-02-12' },
    { id: '8', description: 'Aluguel', amount: 2200, type: 'expense', category_id: '6', date: '2026-02-01' },
    { id: '9', description: 'Condomínio', amount: 650, type: 'expense', category_id: '6', date: '2026-02-01' },
    { id: '10', description: 'Plano de Saúde', amount: 580, type: 'expense', category_id: '7', date: '2026-02-05' },
    { id: '11', description: 'Curso de React', amount: 197, type: 'expense', category_id: '8', date: '2026-02-07' },
    { id: '12', description: 'Cinema', amount: 65, type: 'expense', category_id: '9', date: '2026-02-14' },
    { id: '13', description: 'Assinatura Streaming', amount: 55, type: 'expense', category_id: '9', date: '2026-02-01' },
    { id: '14', description: 'Farmácia', amount: 145, type: 'expense', category_id: '7', date: '2026-02-11' },
    { id: '15', description: 'Ifood', amount: 230, type: 'expense', category_id: '4', date: '2026-02-15' },
    { id: '16', description: 'Salário Mensal', amount: 8500, type: 'income', category_id: '1', date: '2026-01-01' },
    { id: '17', description: 'Aluguel', amount: 2200, type: 'expense', category_id: '6', date: '2026-01-01' },
    { id: '18', description: 'Supermercado', amount: 920, type: 'expense', category_id: '4', date: '2026-01-05' },
    { id: '19', description: 'Combustível', amount: 310, type: 'expense', category_id: '5', date: '2026-01-08' },
    { id: '20', description: 'Cinema', amount: 45, type: 'expense', category_id: '9', date: '2026-01-20' },
];

export const mockGoals: Goal[] = [
    { id: '1', name: 'Viagem Europa', target_amount: 15000, current_amount: 6750, deadline: '2026-12-31' },
    { id: '2', name: 'Reserva de Emergência', target_amount: 30000, current_amount: 18500, deadline: null },
    { id: '3', name: 'Notebook Novo', target_amount: 5000, current_amount: 3200, deadline: '2026-06-30' },
    { id: '4', name: 'Curso Pós-Graduação', target_amount: 12000, current_amount: 2400, deadline: '2026-08-01' },
];

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
