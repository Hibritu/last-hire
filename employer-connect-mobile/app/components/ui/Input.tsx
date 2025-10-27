import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
} from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn('mb-4', containerClassName)}>
      {label && (
        <Text className="text-sm font-medium text-foreground mb-2">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'border border-border rounded-lg px-4 py-3 text-foreground bg-background',
          error && 'border-red-500',
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

export default Input;


