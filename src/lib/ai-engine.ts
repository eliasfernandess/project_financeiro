import { Transaction, Category, Goal } from './types';

export interface FinancialAdvice {
    id: string;
    type: 'warning' | 'tip' | 'success' | 'info';
    title: string;
    message: string;
    icon: string;
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    savingsRate: number;
    topCategory: { name: string; amount: number; percentage: number } | null;
    goalProgress: { completed: number; total: number; overallPercent: number };
    monthlyAvgExpense: number;
    monthlyAvgIncome: number;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

function buildSummary(
    transactions: Transaction[],
    categories: Category[],
    goals: Goal[]
): FinancialSummary {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Top expense category
    const catMap: Record<string, number> = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            if (t.category_id) {
                catMap[t.category_id] = (catMap[t.category_id] || 0) + t.amount;
            }
        });

    let topCategory: FinancialSummary['topCategory'] = null;
    const topCatEntry = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    if (topCatEntry) {
        const cat = categories.find(c => c.id === topCatEntry[0]);
        topCategory = {
            name: cat?.name || 'Desconhecida',
            amount: topCatEntry[1],
            percentage: totalExpense > 0 ? (topCatEntry[1] / totalExpense) * 100 : 0,
        };
    }

    // Goals
    const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
    const totalCurrent = goals.reduce((s, g) => s + g.current_amount, 0);
    const completed = goals.filter(g => g.current_amount >= g.target_amount).length;

    // Monthly averages
    const months = new Set(transactions.map(t => t.date.substring(0, 7)));
    const monthCount = Math.max(months.size, 1);
    const monthlyAvgExpense = totalExpense / monthCount;
    const monthlyAvgIncome = totalIncome / monthCount;

    return {
        totalIncome,
        totalExpense,
        balance,
        savingsRate,
        topCategory,
        goalProgress: {
            completed,
            total: goals.length,
            overallPercent: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0,
        },
        monthlyAvgExpense,
        monthlyAvgIncome,
    };
}

function generateAdvice(
    summary: FinancialSummary,
    transactions: Transaction[],
    categories: Category[],
    goals: Goal[]
): FinancialAdvice[] {
    const advice: FinancialAdvice[] = [];
    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    // 1. Balance check
    if (summary.balance < 0) {
        advice.push({
            id: 'neg-balance',
            type: 'warning',
            title: '⚠️ Saldo Negativo',
            message: `Suas despesas superam suas receitas em ${fmt(Math.abs(summary.balance))}. Revise urgentemente seus gastos para equilibrar o orçamento.`,
            icon: 'AlertTriangle',
        });
    } else if (summary.savingsRate >= 20) {
        advice.push({
            id: 'great-savings',
            type: 'success',
            title: '🎉 Excelente Taxa de Economia!',
            message: `Você está economizando ${summary.savingsRate.toFixed(0)}% da sua renda. Isso é ótimo! A recomendação é manter pelo menos 20%.`,
            icon: 'TrendingUp',
        });
    } else if (summary.savingsRate > 0) {
        advice.push({
            id: 'ok-savings',
            type: 'tip',
            title: '💡 Aumente sua Economia',
            message: `Sua taxa de economia é de ${summary.savingsRate.toFixed(0)}%. Tente chegar a pelo menos 20% cortando gastos não essenciais.`,
            icon: 'Lightbulb',
        });
    }

    // 2. Top category alert
    if (summary.topCategory && summary.topCategory.percentage > 35) {
        advice.push({
            id: 'top-cat',
            type: 'warning',
            title: `📊 Gasto Alto em ${summary.topCategory.name}`,
            message: `${summary.topCategory.name} representa ${summary.topCategory.percentage.toFixed(0)}% das suas despesas (${fmt(summary.topCategory.amount)}). Considere definir um limite mensal para essa categoria.`,
            icon: 'PieChart',
        });
    }

    // 3. Goals advice
    const urgentGoals = goals.filter(g => {
        if (!g.deadline || g.current_amount >= g.target_amount) return false;
        const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const remaining = g.target_amount - g.current_amount;
        const monthsLeft = daysLeft / 30;
        const monthlyNeeded = monthsLeft > 0 ? remaining / monthsLeft : remaining;
        return monthlyNeeded > summary.monthlyAvgIncome * 0.3;
    });

    if (urgentGoals.length > 0) {
        const g = urgentGoals[0];
        const remaining = g.target_amount - g.current_amount;
        advice.push({
            id: 'urgent-goal',
            type: 'warning',
            title: `🎯 Meta "${g.name}" precisa de atenção`,
            message: `Ainda faltam ${fmt(remaining)} para essa meta. O prazo está apertado — considere fazer aportes maiores ou estender o prazo.`,
            icon: 'Target',
        });
    }

    if (summary.goalProgress.completed > 0) {
        advice.push({
            id: 'goals-completed',
            type: 'success',
            title: '🏆 Metas Concluídas!',
            message: `Parabéns! Você já completou ${summary.goalProgress.completed} de ${summary.goalProgress.total} metas. Continue assim!`,
            icon: 'Trophy',
        });
    }

    // 4. 50/30/20 rule
    const essentialCategories = ['Alimentação', 'Moradia', 'Transporte', 'Saúde'];
    const essentialSpend = transactions
        .filter(t => {
            if (t.type !== 'expense') return false;
            const cat = categories.find(c => c.id === t.category_id);
            return cat && essentialCategories.includes(cat.name);
        })
        .reduce((s, t) => s + t.amount, 0);

    if (summary.totalIncome > 0) {
        const essentialPercent = (essentialSpend / summary.totalIncome) * 100;
        if (essentialPercent > 55) {
            advice.push({
                id: 'rule-503020',
                type: 'tip',
                title: '📐 Regra 50/30/20',
                message: `Seus gastos essenciais representam ${essentialPercent.toFixed(0)}% da renda (ideal: até 50%). Busque alternativas mais econômicas para moradia, transporte ou alimentação.`,
                icon: 'Calculator',
            });
        } else {
            advice.push({
                id: 'rule-503020-ok',
                type: 'info',
                title: '📐 Regra 50/30/20',
                message: `Gastos essenciais: ${essentialPercent.toFixed(0)}% (bom, até 50% é ideal). Tente destinar 30% a desejos e 20% a poupança/investimentos.`,
                icon: 'Calculator',
            });
        }
    }

    // 5. Recurring expenses detection
    const descCount: Record<string, number> = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            const key = t.description.toLowerCase();
            descCount[key] = (descCount[key] || 0) + 1;
        });
    const recurring = Object.entries(descCount).filter(([, c]) => c >= 2);
    if (recurring.length > 0) {
        const total = recurring.reduce((s, [desc]) => {
            const last = transactions.find(t => t.description.toLowerCase() === desc && t.type === 'expense');
            return s + (last?.amount || 0);
        }, 0);
        advice.push({
            id: 'recurring',
            type: 'info',
            title: '🔄 Gastos Recorrentes Detectados',
            message: `Encontrei ${recurring.length} gastos que se repetem (total ~${fmt(total)}). Avalie se todos são realmente necessários — cancelar assinaturas não usadas pode economizar bastante.`,
            icon: 'Repeat',
        });
    }

    // 6. Investment suggestion
    if (summary.balance > 0 && summary.savingsRate >= 10) {
        const suggestInvest = summary.balance * 0.3;
        advice.push({
            id: 'invest',
            type: 'tip',
            title: '💰 Sugestão de Investimento',
            message: `Com seu saldo positivo, considere investir cerca de ${fmt(suggestInvest)} (30% do saldo). Comece por Tesouro Direto ou CDBs de liquidez diária para construir reserva.`,
            icon: 'Landmark',
        });
    }

    return advice;
}

export type AIChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

export function getFinancialAnalysis(
    transactions: Transaction[],
    categories: Category[],
    goals: Goal[]
): { summary: FinancialSummary; advice: FinancialAdvice[] } {
    const summary = buildSummary(transactions, categories, goals);
    const advice = generateAdvice(summary, transactions, categories, goals);
    return { summary, advice };
}

export function processUserQuestion(
    question: string,
    transactions: Transaction[],
    categories: Category[],
    goals: Goal[]
): string {
    const { summary, advice } = getFinancialAnalysis(transactions, categories, goals);
    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    const q = question.toLowerCase();
    const greeting = getGreeting();

    // Greeting
    if (q.includes('olá') || q.includes('oi') || q.includes('hey') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite')) {
        return `${greeting}! 👋 Sou seu assistente financeiro. Posso te ajudar a analisar seus gastos, metas e dar dicas para se organizar melhor. O que gostaria de saber?`;
    }

    // Spending analysis
    if (q.includes('gasto') || q.includes('despesa') || q.includes('gastei') || q.includes('análise')) {
        let response = `📊 **Análise de Gastos**\n\n`;
        response += `• Total de despesas: **${fmt(summary.totalExpense)}**\n`;
        response += `• Média mensal: **${fmt(summary.monthlyAvgExpense)}**\n`;
        if (summary.topCategory) {
            response += `• Maior categoria: **${summary.topCategory.name}** (${summary.topCategory.percentage.toFixed(0)}% — ${fmt(summary.topCategory.amount)})\n`;
        }
        response += `\n`;

        const relevantAdvice = advice.filter(a => a.id === 'top-cat' || a.id === 'rule-503020' || a.id === 'rule-503020-ok');
        if (relevantAdvice.length > 0) {
            response += `💡 **Dica:** ${relevantAdvice[0].message}`;
        }
        return response;
    }

    // Savings / economy
    if (q.includes('economiz') || q.includes('poupar') || q.includes('econom') || q.includes('dica')) {
        let response = `💰 **Dicas de Economia**\n\n`;
        response += `Sua taxa de economia atual: **${summary.savingsRate.toFixed(0)}%** da renda.\n\n`;
        response += `Aqui vão algumas dicas práticas:\n\n`;
        response += `1. **Regra 50/30/20:** Destine 50% a necessidades, 30% a desejos, 20% a poupança\n`;
        response += `2. **Revise assinaturas:** Cancele serviços que não usa com frequência\n`;
        response += `3. **Liste compras:** Nunca vá ao supermercado sem lista — isso reduz compras por impulso\n`;
        response += `4. **Defina limites:** Estabeleça tetos para cada categoria de gasto\n`;
        response += `5. **Automatize:** Programe transferências automáticas para investimentos no dia do pagamento\n`;

        if (summary.balance > 0) {
            response += `\nCom seu saldo de **${fmt(summary.balance)}**, sugerimos investir pelo menos **${fmt(summary.balance * 0.2)}** em reserva de emergência.`;
        }
        return response;
    }

    // Goals
    if (q.includes('meta') || q.includes('objetivo') || q.includes('goal')) {
        let response = `🎯 **Status das Metas**\n\n`;
        response += `Progresso geral: **${summary.goalProgress.overallPercent.toFixed(0)}%** (${summary.goalProgress.completed}/${summary.goalProgress.total} concluídas)\n\n`;

        goals.forEach(g => {
            const progress = g.target_amount > 0 ? (g.current_amount / g.target_amount) * 100 : 0;
            const remaining = g.target_amount - g.current_amount;
            const bar = progress >= 100 ? '✅' : progress >= 50 ? '🟡' : '🔴';
            response += `${bar} **${g.name}:** ${progress.toFixed(0)}% — faltam ${fmt(remaining)}\n`;

            if (g.deadline) {
                const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysLeft > 0 && remaining > 0) {
                    const monthlyNeeded = remaining / (daysLeft / 30);
                    response += `   → Precisa guardar ~**${fmt(monthlyNeeded)}/mês** (${daysLeft} dias restantes)\n`;
                }
            }
        });
        return response;
    }

    // Balance
    if (q.includes('saldo') || q.includes('balanço') || q.includes('receita')) {
        let response = `💳 **Resumo Financeiro**\n\n`;
        response += `• Receitas: **${fmt(summary.totalIncome)}**\n`;
        response += `• Despesas: **${fmt(summary.totalExpense)}**\n`;
        response += `• Saldo: **${fmt(summary.balance)}** ${summary.balance >= 0 ? '✅' : '❌'}\n`;
        response += `• Taxa de economia: **${summary.savingsRate.toFixed(0)}%**\n`;
        return response;
    }

    // Default: full analysis
    let response = `${greeting}! Aqui vai sua **análise financeira completa**:\n\n`;
    response += `💳 **Receitas:** ${fmt(summary.totalIncome)} | **Despesas:** ${fmt(summary.totalExpense)} | **Saldo:** ${fmt(summary.balance)}\n\n`;

    if (advice.length > 0) {
        response += `📋 **Conselhos Personalizados:**\n\n`;
        advice.slice(0, 4).forEach(a => {
            response += `${a.title}\n${a.message}\n\n`;
        });
    }

    response += `Pergunte sobre: gastos, metas, economia, ou saldo para detalhes específicos! 😊`;
    return response;
}
