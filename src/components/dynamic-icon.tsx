'use client';

import { LucideProps } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import * as icons from 'lucide-react';

interface DynamicIconProps extends LucideProps {
    name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap = icons as unknown as Record<string, React.ComponentType<any>>;

export const DynamicIcon = memo(function DynamicIcon({ name, ...props }: DynamicIconProps) {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
        const FallbackIcon = iconMap['Tag'];
        return FallbackIcon ? <FallbackIcon {...props} /> : null;
    }
    return <IconComponent {...props} />;
});
