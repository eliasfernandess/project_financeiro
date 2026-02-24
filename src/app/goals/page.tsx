'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, PiggyBank, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Metas de Economia</h1>
                    <p className="text-muted-foreground mt-1">Acompanhe o progresso das suas economias</p>
                </div>
                <Button onClick={() => { setEditingGoal(null); setModalOpen(true); }} className="gap-2 gradient-primary border-0 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Nova Meta
                </Button>
            </div>

            {/* Overall Progress */}
            <Card className="relative overflow-hidden glass-card animate-slide-up delay-1">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <PiggyBank className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Progresso Total</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalCurrent)} <span className="text-base font-normal text-muted-foreground">de {formatCurrency(totalTarget)}</span></p>
                        </div>
                    </div>
                    <Progress value={overallProgress} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-2">{overallProgress.toFixed(1)}% concluído</p>
                </CardContent>
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12" />
            </Card>

            {/* Goal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal, i) => {
                    const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                    const remaining = goal.target_amount - goal.current_amount;
                    const daysLeft = goal.deadline ? differenceInDays(parseISO(goal.deadline), new Date()) : null;
                    const isComplete = progress >= 100;

                    return (
                        <Card key={goal.id} className={`group glass-card hover:shadow-xl transition-all duration-300 animate-slide-up delay-${Math.min(i + 2, 8)}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        {isComplete && <span className="text-lg">🎉</span>}
                                        <CardTitle className="text-base font-semibold">{goal.name}</CardTitle>
                                    </div>
                                    <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-xl"
                                            onClick={() => { setEditingGoal(goal); setModalOpen(true); }}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-xl"
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
                                        className="h-3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl glass-surface">
                                        <p className="text-xs text-muted-foreground">Economizado</p>
                                        <p className="text-sm font-semibold text-emerald-500">{formatCurrency(goal.current_amount)}</p>
                                    </div>
                                    <div className="p-3 rounded-xl glass-surface">
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
                                        className="gap-1.5 text-xs rounded-xl gradient-primary border-0 text-white shadow-md"
                                        onClick={() => setAddAmountGoal(goal)}
                                        disabled={isComplete}
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
