import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import { cn } from '@/lib/utils';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
    destructive: 'bg-red-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    default: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textVariantStyles = {
    default: 'text-white',
    secondary: 'text-foreground',
    outline: 'text-primary',
    ghost: 'text-primary',
    destructive: 'text-white',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={cn(
        'rounded-lg items-center justify-center flex-row',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#22c55e' : '#ffffff'}
        />
      ) : (
        typeof children === 'string' ? (
          <Text
            className={cn(
              'font-semibold',
              textVariantStyles[variant],
              textSizeStyles[size]
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )
      )}
    </TouchableOpacity>
  );
}

export default Button;


