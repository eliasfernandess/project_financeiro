'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Category } from '@/lib/types';
import { availableIcons, categoryColors } from '@/lib/mock-data';
import { DynamicIcon } from './dynamic-icon';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null;
    onSave: (data: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
}

export function CategoryModal({ open, onOpenChange, category, onSave }: CategoryModalProps) {
    const [name, setName] = useState(category?.name || '');
    const [icon, setIcon] = useState(category?.icon || 'Tag');
    const [color, setColor] = useState(category?.color || '#6366f1');
    const [type, setType] = useState<'income' | 'expense'>(category?.type || 'expense');
    const [loading, setLoading] = useState(false);
    const [showIcons, setShowIcons] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        setLoading(true);
        await onSave({ name, icon, color, type });
        setName('');
        setIcon('Tag');
        setColor('#6366f1');
        setType('expense');
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{category ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Alimentação"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={type} onValueChange={(v: 'income' | 'expense') => setType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Despesa</SelectItem>
                                <SelectItem value="income">Receita</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Ícone</Label>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => setShowIcons(!showIcons)}
                        >
                            <DynamicIcon name={icon} className="h-4 w-4" style={{ color }} />
                            {icon}
                        </Button>
                        {showIcons && (
                            <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
                                {availableIcons.map(ic => (
                                    <button
                                        key={ic}
                                        type="button"
                                        className={cn(
                                            'h-10 w-10 rounded-lg flex items-center justify-center transition-all hover:bg-accent',
                                            icon === ic && 'bg-primary text-primary-foreground'
                                        )}
                                        onClick={() => { setIcon(ic); setShowIcons(false); }}
                                        title={ic}
                                    >
                                        <DynamicIcon name={ic} className="h-4 w-4" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Cor</Label>
                        <div className="grid grid-cols-10 gap-2">
                            {categoryColors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={cn(
                                        'h-8 w-8 rounded-full transition-all border-2',
                                        color === c ? 'border-foreground scale-110' : 'border-transparent hover:scale-110'
                                    )}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading || !name}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
