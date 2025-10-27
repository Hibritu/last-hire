import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({
  size = 'large',
  color = '#22c55e',
  text,
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const content = (
    <View className={cn('items-center justify-center', className)}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className="mt-4 text-muted-foreground text-center">
          {text}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        {content}
      </View>
    );
  }

  return content;
}

export default LoadingSpinner;


