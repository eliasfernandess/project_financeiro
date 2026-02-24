'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Target,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Início', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { href: '/categories', label: 'Categorias', icon: Tags },
  { href: '/goals', label: 'Metas', icon: Target },
  { href: '/ai', label: 'IA', icon: Bot },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass-card border-t border-border/50 px-1 pt-1 pb-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 min-w-[56px]',
                  isActive
                    ? 'text-primary scale-105'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                )}
              >
                <div className="relative">
                  <item.icon className={cn('h-5 w-5 transition-all duration-300', isActive && 'drop-shadow-[0_0_8px_oklch(0.7_0.2_270/50%)]')} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full gradient-primary" />
                  )}
                </div>
                <span className={cn('text-[10px] font-medium leading-tight', isActive && 'font-semibold')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
