'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { mockCategories, mockTransactions, mockGoals } from './mock-data';
import { Category, Transaction, Goal } from './types';

function generateId() {
    return crypto.randomUUID();
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [loading, setLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        if (!isSupabaseConfigured || !supabase) {
            setCategories(mockCategories);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data) setCategories(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const addCategory = useCallback(async (cat: Omit<Category, 'id' | 'created_at'>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('categories').insert(cat).select().single();
            if (!error && data) setCategories(prev => [...prev, data]);
            return data;
        }
        const newCat = { ...cat, id: generateId() };
        setCategories(prev => [...prev, newCat]);
        return newCat;
    }, []);

    const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
            if (!error && data) setCategories(prev => prev.map(c => c.id === id ? data : c));
            return data;
        }
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('categories').delete().eq('id', id);
        }
        setCategories(prev => prev.filter(c => c.id !== id));
    }, []);

    return { categories, loading, addCategory, updateCategory, deleteCategory, fetchCategories };
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = useCallback(async () => {
        if (!isSupabaseConfigured || !supabase) {
            setTransactions(mockTransactions);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select('*, category:categories(*)')
            .order('date', { ascending: false });
        if (!error && data) setTransactions(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

    const addTransaction = useCallback(async (tx: Omit<Transaction, 'id' | 'created_at' | 'category'>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('transactions').insert(tx).select('*, category:categories(*)').single();
            if (!error && data) setTransactions(prev => [data, ...prev]);
            return data;
        }
        const newTx = { ...tx, id: generateId() };
        setTransactions(prev => [newTx, ...prev]);
        return newTx;
    }, []);

    const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select('*, category:categories(*)').single();
            if (!error && data) setTransactions(prev => prev.map(t => t.id === id ? data : t));
            return data;
        }
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);

    const deleteTransaction = useCallback(async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('transactions').delete().eq('id', id);
        }
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    return { transactions, loading, addTransaction, updateTransaction, deleteTransaction, fetchTransactions };
}

export function useGoals() {
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [loading, setLoading] = useState(false);

    const fetchGoals = useCallback(async () => {
        if (!isSupabaseConfigured || !supabase) {
            setGoals(mockGoals);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
        if (!error && data) setGoals(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchGoals(); }, [fetchGoals]);

    const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'created_at'>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('goals').insert(goal).select().single();
            if (!error && data) setGoals(prev => [data, ...prev]);
            return data;
        }
        const newGoal = { ...goal, id: generateId() };
        setGoals(prev => [newGoal, ...prev]);
        return newGoal;
    }, []);

    const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('goals').update(updates).eq('id', id).select().single();
            if (!error && data) setGoals(prev => prev.map(g => g.id === id ? data : g));
            return data;
        }
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    }, []);

    const deleteGoal = useCallback(async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('goals').delete().eq('id', id);
        }
        setGoals(prev => prev.filter(g => g.id !== id));
    }, []);

    const addAmountToGoal = useCallback(async (id: string, amount: number) => {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;
        const newAmount = Math.min(goal.current_amount + amount, goal.target_amount);
        await updateGoal(id, { current_amount: newAmount });
    }, [goals, updateGoal]);

    return { goals, loading, addGoal, updateGoal, deleteGoal, addAmountToGoal, fetchGoals };
}
