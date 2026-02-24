'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, Sparkles, TrendingUp, Target, PiggyBank, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { processUserQuestion, getFinancialAnalysis } from '@/lib/ai-engine';
import { Transaction, Category, Goal } from '@/lib/types';
import type { AIChatMessage } from '@/lib/ai-engine';

interface AIChatProps {
    transactions: Transaction[];
    categories: Category[];
    goals: Goal[];
    fullPage?: boolean;
}

const quickActions = [
    { label: 'Análise de Gastos', icon: TrendingUp, query: 'Analise meus gastos' },
    { label: 'Como Economizar?', icon: PiggyBank, query: 'Me dê dicas para economizar' },
    { label: 'Status das Metas', icon: Target, query: 'Como estão minhas metas?' },
    { label: 'Resumo Financeiro', icon: Sparkles, query: 'Qual meu resumo financeiro?' },
];

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

export function AIChat({ transactions, categories, goals, fullPage = false }: AIChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMsg: AIChatMessage = {
            id: generateId(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800));

        const response = processUserQuestion(text, transactions, categories, goals);

        const aiMsg: AIChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    }, [transactions, categories, goals]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    useEffect(() => {
        if ((isOpen || fullPage) && messages.length === 0) {
            const { advice } = getFinancialAnalysis(transactions, categories, goals);
            const hour = new Date().getHours();
            const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

            let welcome = `${greeting}! 👋 Sou seu **assistente financeiro** com IA.\n\n`;
            welcome += `Posso te ajudar a:\n`;
            welcome += `• 📊 Analisar seus gastos e padrões\n`;
            welcome += `• 💡 Dar dicas para economizar mais\n`;
            welcome += `• 🎯 Acompanhar suas metas\n`;
            welcome += `• 📋 Criar um plano financeiro\n\n`;

            if (advice.length > 0) {
                welcome += `Já notei algo: **${advice[0].title}** — pergunte para saber mais!`;
            }

            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: welcome,
                timestamp: new Date(),
            }]);
        }
    }, [isOpen, fullPage, messages.length, transactions, categories, goals]);

    const chatContent = (
        <div className={cn('flex flex-col', fullPage ? 'h-full' : 'h-[500px] max-h-[70vh]')}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={cn(
                            'flex animate-slide-up',
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        <div
                            className={cn(
                                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                                msg.role === 'user'
                                    ? 'gradient-primary text-white rounded-br-md'
                                    : 'glass-card rounded-bl-md'
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex items-center gap-1.5 mb-2 text-primary">
                                    <Bot className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">FinAI</span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-1.5 mb-1 text-primary">
                                <Bot className="h-3.5 w-3.5" />
                                <span className="text-xs font-semibold">FinAI</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick actions (show when few messages) */}
            {messages.length <= 1 && (
                <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                        {quickActions.map(action => (
                            <button
                                key={action.label}
                                onClick={() => sendMessage(action.query)}
                                className="flex items-center gap-2 p-2.5 rounded-xl glass-card text-xs font-medium text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                <action.icon className="h-4 w-4 text-primary shrink-0" />
                                <span className="truncate">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pergunte sobre suas finanças..."
                        className="flex-1 h-10 px-4 rounded-xl bg-accent/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        disabled={isTyping}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="h-10 w-10 rounded-xl gradient-primary border-0 shrink-0"
                        disabled={!input.trim() || isTyping}
                    >
                        <Send className="h-4 w-4 text-white" />
                    </Button>
                </form>
            </div>
        </div>
    );

    // Full page mode
    if (fullPage) {
        return chatContent;
    }

    // Floating mode (desktop only)
    return (
        <>
            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'hidden lg:flex fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl items-center justify-center transition-all duration-300 shadow-lg',
                    isOpen
                        ? 'bg-destructive text-white rotate-90'
                        : 'gradient-primary text-white animate-pulse-glow hover:scale-110'
                )}
            >
                {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="hidden lg:block fixed bottom-24 right-6 z-50 w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-background animate-scale-in">
                    {/* Header */}
                    <div className="gradient-primary p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">FinAI — Assistente</h3>
                            <p className="text-white/70 text-xs">Conselhos financeiros inteligentes</p>
                        </div>
                    </div>

                    {chatContent}
                </div>
            )}
        </>
    );
}
