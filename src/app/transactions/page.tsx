'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownRight, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTransactions, useCategories } from '@/lib/hooks';
import { DynamicIcon } from '@/components/dynamic-icon';
import { TransactionModal } from '@/components/transaction-modal';
import { format, parseISO } from 'date-fns';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function TransactionsPage() {
    const { transactions, addTransaction, deleteTransaction } = useTransactions();
    const { categories } = useCategories();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);

    const filtered = useMemo(() => {
        return transactions
            .filter(t => {
                if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
                if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
                if (typeFilter !== 'all' && t.type !== typeFilter) return false;
                return true;
            })
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [transactions, search, categoryFilter, typeFilter]);

    const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transações</h1>
                    <p className="text-muted-foreground mt-1">Gerencie suas receitas e despesas</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2 gradient-primary border-0 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Nova Transação
                </Button>
            </div>

            {/* Summary mini cards */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="glass-card animate-slide-up delay-1">
                    <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                        <div className="h-10 w-10 rounded-xl gradient-income flex items-center justify-center shadow-md shrink-0">
                            <ArrowUpRight className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Receitas</p>
                            <p className="text-sm sm:text-lg font-bold text-emerald-500 truncate">{formatCurrency(totalIncome)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card animate-slide-up delay-2">
                    <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                        <div className="h-10 w-10 rounded-xl gradient-expense flex items-center justify-center shadow-md shrink-0">
                            <ArrowDownRight className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Despesas</p>
                            <p className="text-sm sm:text-lg font-bold text-red-500 truncate">{formatCurrency(totalExpense)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="glass-card animate-slide-up delay-3">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar descrição..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 rounded-xl"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas categorias</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os tipos</SelectItem>
                                <SelectItem value="income">Receita</SelectItem>
                                <SelectItem value="expense">Despesa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile: Card list / Desktop: Table */}
            {/* Mobile Cards */}
            <div className="md:hidden space-y-2">
                {filtered.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="text-center py-8 text-muted-foreground">
                            Nenhuma transação encontrada
                        </CardContent>
                    </Card>
                ) : (
                    filtered.map((tx, i) => {
                        const cat = categories.find(c => c.id === tx.category_id);
                        return (
                            <Card key={tx.id} className={`glass-card animate-slide-up delay-${Math.min(i + 1, 8)}`}>
                                <CardContent className="flex items-center gap-3 p-3">
                                    <div
                                        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: cat ? `${cat.color}20` : '#64748b20' }}
                                    >
                                        <DynamicIcon
                                            name={cat?.icon || 'Tag'}
                                            className="h-4.5 w-4.5"
                                            style={{ color: cat?.color || '#64748b' }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {cat?.name || 'Sem categoria'} • {format(parseISO(tx.date), 'dd/MM/yyyy')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="text-right">
                                            <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 touch-visible"
                                            onClick={() => deleteTransaction(tx.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Desktop Table */}
            <Card className="glass-card hidden md:block animate-slide-up delay-4">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhuma transação encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map(tx => {
                                    const cat = categories.find(c => c.id === tx.category_id);
                                    return (
                                        <TableRow key={tx.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                                                        style={{ backgroundColor: cat ? `${cat.color}20` : '#64748b20' }}
                                                    >
                                                        <DynamicIcon
                                                            name={cat?.icon || 'Tag'}
                                                            className="h-4 w-4"
                                                            style={{ color: cat?.color || '#64748b' }}
                                                        />
                                                    </div>
                                                    <p className="font-medium text-sm">{tx.description}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal rounded-lg">
                                                    {cat?.name || 'Sem categoria'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(parseISO(tx.date), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => deleteTransaction(tx.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TransactionModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                categories={categories}
                onSave={async (data) => {
                    await addTransaction(data);
                    setModalOpen(false);
                }}
            />
        </div>
    );
}
