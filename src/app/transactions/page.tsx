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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transações</h1>
                    <p className="text-muted-foreground mt-1">Gerencie suas receitas e despesas</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Transação
                </Button>
            </div>

            {/* Summary mini cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Receitas (filtrado)</p>
                            <p className="text-lg font-bold text-emerald-500">{formatCurrency(totalIncome)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <ArrowDownRight className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Despesas (filtrado)</p>
                            <p className="text-lg font-bold text-red-500">{formatCurrency(totalExpense)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="h-4 w-4" />
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
                                className="pl-9"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
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
                            <SelectTrigger>
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

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                                <TableHead className="hidden md:table-cell">Data</TableHead>
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
                                                        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                                                        style={{ backgroundColor: cat ? `${cat.color}15` : '#64748b15' }}
                                                    >
                                                        <DynamicIcon
                                                            name={cat?.icon || 'Tag'}
                                                            className="h-3.5 w-3.5"
                                                            style={{ color: cat?.color || '#64748b' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{tx.description}</p>
                                                        <p className="text-xs text-muted-foreground sm:hidden">
                                                            {cat?.name} • {format(parseISO(tx.date), 'dd/MM/yyyy')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="secondary" className="font-normal">
                                                    {cat?.name || 'Sem categoria'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
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
