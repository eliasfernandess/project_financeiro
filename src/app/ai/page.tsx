'use client';

import { Bot } from 'lucide-react';
import { AIChat } from '@/components/ai-chat';
import { useTransactions, useCategories, useGoals } from '@/lib/hooks';

export default function AIPage() {
    const { transactions } = useTransactions();
    const { categories } = useCategories();
    const { goals } = useGoals();

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-3rem)] animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">FinAI — Assistente</h1>
                    <p className="text-xs text-muted-foreground">Conselhos financeiros inteligentes</p>
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-border/50 glass-card">
                <AIChat
                    transactions={transactions}
                    categories={categories}
                    goals={goals}
                    fullPage
                />
            </div>
        </div>
    );
}
