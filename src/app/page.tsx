'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTransactions, useCategories, useGoals } from '@/lib/hooks';
import { mockCategories } from '@/lib/mock-data';
import { DynamicIcon } from '@/components/dynamic-icon';
import { AIChat } from '@/components/ai-chat';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia ☀️';
  if (hour < 18) return 'Boa tarde 🌤️';
  return 'Boa noite 🌙';
}

export default function DashboardPage() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { goals } = useGoals();

  const totalIncome = useMemo(
    () => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpense;

  const categoryExpenses = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string; icon: string }> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = mockCategories.find(c => c.id === t.category_id);
        if (cat) {
          if (!map[cat.id]) map[cat.id] = { name: cat.name, value: 0, color: cat.color, icon: cat.icon };
          map[cat.id].value += t.amount;
        }
      });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map: Record<string, { month: string; income: number; expense: number }> = {};
    transactions.forEach(t => {
      const monthKey = format(parseISO(t.date), 'yyyy-MM');
      const monthLabel = format(parseISO(t.date), 'MMM', { locale: ptBR });
      if (!map[monthKey]) map[monthKey] = { month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1), income: 0, expense: 0 };
      if (t.type === 'income') map[monthKey].income += t.amount;
      else map[monthKey].expense += t.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [transactions]);

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="animate-slide-down">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Visão geral das suas finanças
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden glass-card animate-slide-up delay-1 group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
            <div className="h-10 w-10 rounded-xl gradient-income flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 gradient-income" />
        </Card>

        <Card className="relative overflow-hidden glass-card animate-slide-up delay-2 group hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
            <div className="h-10 w-10 rounded-xl gradient-expense flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 gradient-expense" />
        </Card>

        <Card className="relative overflow-hidden glass-card animate-slide-up delay-3 group sm:col-span-2 lg:col-span-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
            <div className="h-10 w-10 rounded-xl gradient-balance flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Receitas − Despesas</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 gradient-balance" />
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="glass-card animate-slide-up delay-4">
          <CardHeader>
            <CardTitle className="text-base">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {categoryExpenses.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryExpenses.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="truncate text-muted-foreground">{entry.name}</span>
                  <span className="ml-auto font-medium text-xs">{formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="glass-card animate-slide-up delay-5">
          <CardHeader>
            <CardTitle className="text-base">Receita vs Despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Receita" fill="#22c55e" radius={[6, 6, 0, 0]} animationBegin={400} animationDuration={800} />
                  <Bar dataKey="expense" name="Despesa" fill="#ef4444" radius={[6, 6, 0, 0]} animationBegin={600} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-card animate-slide-up delay-6">
        <CardHeader>
          <CardTitle className="text-base">Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.map((tx, i) => {
              const cat = mockCategories.find(c => c.id === tx.category_id);
              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 animate-slide-up delay-${i + 1}`}
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat ? `${cat.color}20` : '#64748b20' }}
                  >
                    <DynamicIcon
                      name={cat?.icon || 'Tag'}
                      className="h-4 w-4"
                      style={{ color: cat?.color || '#64748b' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {cat?.name || 'Sem categoria'} • {format(parseISO(tx.date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Chat (desktop floating) */}
      <AIChat
        transactions={transactions}
        categories={categories}
        goals={goals}
      />
    </div>
  );
}
