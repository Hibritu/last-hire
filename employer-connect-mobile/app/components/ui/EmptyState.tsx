import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center py-12 px-6', className)}>
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-xl font-semibold text-foreground text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-muted-foreground text-center mb-6">
          {description}
        </Text>
      )}
      {action && action}
    </View>
  );
}

export default EmptyState;


