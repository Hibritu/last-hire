import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    destructive: 'bg-red-500',
  };

  const textStyles = {
    default: 'text-white',
    secondary: 'text-foreground',
    success: 'text-white',
    warning: 'text-white',
    destructive: 'text-white',
  };

  return (
    <View
      className={cn(
        'px-2.5 py-1 rounded-full inline-flex items-center justify-center',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <Text className={cn('text-xs font-semibold', textStyles[variant])}>
        {children}
      </Text>
    </View>
  );
}

export default Badge;


