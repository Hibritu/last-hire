import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
} from 'react-native';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function TextArea({
  label,
  error,
  containerClassName,
  className,
  ...props
}: TextAreaProps) {
  return (
    <View className={cn('mb-4', containerClassName)}>
      {label && (
        <Text className="text-sm font-medium text-foreground mb-2">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'border border-border rounded-lg px-4 py-3 text-foreground bg-background min-h-[100px]',
          error && 'border-red-500',
          className
        )}
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
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

export default TextArea;


