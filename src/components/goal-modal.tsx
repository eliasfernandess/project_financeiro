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
import { Goal } from '@/lib/types';

interface GoalModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    goal?: Goal | null;
    onSave: (data: Omit<Goal, 'id' | 'created_at'>) => Promise<void>;
}

export function GoalModal({ open, onOpenChange, goal, onSave }: GoalModalProps) {
    const [name, setName] = useState(goal?.name || '');
    const [targetAmount, setTargetAmount] = useState(goal?.target_amount?.toString() || '');
    const [currentAmount, setCurrentAmount] = useState(goal?.current_amount?.toString() || '0');
    const [deadline, setDeadline] = useState(goal?.deadline || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !targetAmount) return;
        setLoading(true);
        await onSave({
            name,
            target_amount: parseFloat(targetAmount),
            current_amount: parseFloat(currentAmount) || 0,
            deadline: deadline || null,
        });
        setName('');
        setTargetAmount('');
        setCurrentAmount('0');
        setDeadline('');
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{goal ? 'Editar Meta' : 'Nova Meta'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="goal-name">Nome da Meta</Label>
                        <Input
                            id="goal-name"
                            placeholder="Ex: Viagem Europa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target">Valor Alvo (R$)</Label>
                        <Input
                            id="target"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0,00"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="current">Valor Atual (R$)</Label>
                        <Input
                            id="current"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                            value={currentAmount}
                            onChange={(e) => setCurrentAmount(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deadline">Prazo (opcional)</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading || !name || !targetAmount}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface AddAmountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    goalName: string;
    onSave: (amount: number) => Promise<void>;
}

export function AddAmountModal({ open, onOpenChange, goalName, onSave }: AddAmountModalProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        setLoading(true);
        await onSave(parseFloat(amount));
        setAmount('');
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Adicionar valor — {goalName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="add-amount">Valor (R$)</Label>
                        <Input
                            id="add-amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading || !amount}>
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
