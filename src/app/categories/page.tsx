'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/lib/hooks';
import { DynamicIcon } from '@/components/dynamic-icon';
import { CategoryModal } from '@/components/category-modal';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
    const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Categorias</h1>
                    <p className="text-muted-foreground mt-1">Organize suas transações com categorias personalizadas</p>
                </div>
                <Button onClick={() => { setEditingCategory(null); setModalOpen(true); }} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Categoria
                </Button>
            </div>

            {/* Income Categories */}
            <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Receitas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {incomeCategories.map(cat => (
                        <Card key={cat.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${cat.color}15` }}
                                >
                                    <DynamicIcon name={cat.icon} className="h-5 w-5" style={{ color: cat.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{cat.name}</p>
                                    <Badge variant="secondary" className="text-xs">Receita</Badge>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cat)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCategory(cat.id)}>
                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Expense Categories */}
            <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Despesas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {expenseCategories.map(cat => (
                        <Card key={cat.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${cat.color}15` }}
                                >
                                    <DynamicIcon name={cat.icon} className="h-5 w-5" style={{ color: cat.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{cat.name}</p>
                                    <Badge variant="secondary" className="text-xs">Despesa</Badge>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cat)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCategory(cat.id)}>
                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <CategoryModal
                open={modalOpen}
                onOpenChange={handleClose}
                category={editingCategory}
                onSave={async (data) => {
                    if (editingCategory) {
                        await updateCategory(editingCategory.id, data);
                    } else {
                        await addCategory(data);
                    }
                    handleClose();
                }}
            />
        </div>
    );
}
