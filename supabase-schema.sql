-- ============================================
-- FinApp — Supabase Schema
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- Categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Tag',
  color TEXT NOT NULL DEFAULT '#6366f1',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transações
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Metas de economia
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- Enable Row Level Security (opcional — necessário se usar auth)
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Categorias padrão
INSERT INTO categories (name, icon, color, type) VALUES
  ('Salário', 'Briefcase', '#22c55e', 'income'),
  ('Freelance', 'Laptop', '#3b82f6', 'income'),
  ('Investimentos', 'TrendingUp', '#8b5cf6', 'income'),
  ('Alimentação', 'UtensilsCrossed', '#ef4444', 'expense'),
  ('Transporte', 'Car', '#f97316', 'expense'),
  ('Moradia', 'Home', '#ec4899', 'expense'),
  ('Saúde', 'Heart', '#14b8a6', 'expense'),
  ('Educação', 'GraduationCap', '#6366f1', 'expense'),
  ('Lazer', 'Gamepad2', '#eab308', 'expense'),
  ('Outros', 'MoreHorizontal', '#64748b', 'expense');
