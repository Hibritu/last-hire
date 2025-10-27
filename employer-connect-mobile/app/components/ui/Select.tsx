import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewProps,
} from 'react-native';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends ViewProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  containerClassName,
  className,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className={cn('mb-4', containerClassName)} {...props}>
      {label && (
        <Text className="text-sm font-medium text-foreground mb-2">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={cn(
          'border border-border rounded-lg px-4 py-3 bg-background',
          error && 'border-red-500',
          className
        )}
      >
        <Text className={cn('text-foreground', !selectedOption && 'text-gray-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-background rounded-t-2xl max-h-96">
            <View className="p-4 border-b border-border">
              <Text className="text-lg font-semibold text-foreground">
                {label || 'Select an option'}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={cn(
                    'px-4 py-4 border-b border-border',
                    item.value === value && 'bg-primary/10'
                  )}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    className={cn(
                      'text-base',
                      item.value === value ? 'text-primary font-semibold' : 'text-foreground'
                    )}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default Select;


