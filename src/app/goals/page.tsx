'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, PiggyBank, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGoals } from '@/lib/hooks';
import { GoalModal, AddAmountModal } from '@/components/goal-modal';
import { Goal } from '@/lib/types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function GoalsPage() {
    const { goals, addGoal, updateGoal, deleteGoal, addAmountToGoal } = useGoals();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [addAmountGoal, setAddAmountGoal] = useState<Goal | null>(null);

    const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
    const totalCurrent = goals.reduce((s, g) => s + g.current_amount, 0);
    const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    const handleClose = () => {
        setModalOpen(false);
        setEditingGoal(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Metas de Economia</h1>
                    <p className="text-muted-foreground mt-1">Acompanhe o progresso das suas economias</p>
                </div>
                <Button onClick={() => { setEditingGoal(null); setModalOpen(true); }} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Meta
                </Button>
            </div>

            {/* Overall Progress */}
            <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <PiggyBank className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Progresso Total</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalCurrent)} <span className="text-base font-normal text-muted-foreground">de {formatCurrency(totalTarget)}</span></p>
                        </div>
                    </div>
                    <Progress value={overallProgress} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-2">{overallProgress.toFixed(1)}% concluído</p>
                </CardContent>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            </Card>

            {/* Goal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(goal => {
                    const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                    const remaining = goal.target_amount - goal.current_amount;
                    const daysLeft = goal.deadline ? differenceInDays(parseISO(goal.deadline), new Date()) : null;

                    return (
                        <Card key={goal.id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base font-semibold">{goal.name}</CardTitle>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => { setEditingGoal(goal); setModalOpen(true); }}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => deleteGoal(goal.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Progresso</span>
                                        <span className="font-medium">{progress.toFixed(1)}%</span>
                                    </div>
                                    <Progress
                                        value={progress}
                                        className="h-2.5"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-accent/50">
                                        <p className="text-xs text-muted-foreground">Economizado</p>
                                        <p className="text-sm font-semibold text-emerald-500">{formatCurrency(goal.current_amount)}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-accent/50">
                                        <p className="text-xs text-muted-foreground">Faltam</p>
                                        <p className="text-sm font-semibold">{formatCurrency(remaining)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        {goal.deadline && (
                                            <>
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {format(parseISO(goal.deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                    {daysLeft !== null && daysLeft > 0 && (
                                                        <span className="ml-1">({daysLeft} dias)</span>
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1.5 text-xs"
                                        onClick={() => setAddAmountGoal(goal)}
                                        disabled={progress >= 100}
                                    >
                                        <TrendingUp className="h-3 w-3" />
                                        Adicionar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <GoalModal
                open={modalOpen}
                onOpenChange={handleClose}
                goal={editingGoal}
                onSave={async (data) => {
                    if (editingGoal) {
                        await updateGoal(editingGoal.id, data);
                    } else {
                        await addGoal(data);
                    }
                    handleClose();
                }}
            />

            {addAmountGoal && (
                <AddAmountModal
                    open={!!addAmountGoal}
                    onOpenChange={(open) => { if (!open) setAddAmountGoal(null); }}
                    goalName={addAmountGoal.name}
                    onSave={async (amount) => {
                        await addAmountToGoal(addAmountGoal.id, amount);
                        setAddAmountGoal(null);
                    }}
                />
            )}
        </div>
    );
}
