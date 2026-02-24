'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ArrowLeftRight,
    Tags,
    Target,
    Bot,
    Wallet,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { href: '/categories', label: 'Categorias', icon: Tags },
    { href: '/goals', label: 'Metas', icon: Target },
    { href: '/ai', label: 'IA Financeira', icon: Bot },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'hidden lg:flex fixed top-0 left-0 z-40 h-full w-64 border-r border-border/50 flex-col',
                'bg-sidebar/80 backdrop-blur-xl'
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-border/50">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl gradient-primary shadow-lg">
                    <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none gradient-text">FinApp</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Gestão Financeira</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'gradient-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tema</span>
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
