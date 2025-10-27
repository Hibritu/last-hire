import * as React from 'react';
import { TextInput, Platform } from 'react-native';
import { cn } from '../../lib/utils';

const Input = React.forwardRef<
  TextInput,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderTextColor, ...props }, ref) => {
  return (
    <TextInput
      className={cn(
        'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground',
        'disabled:opacity-50',
        Platform.OS === 'android' ? 'text-base' : 'text-sm',
        className
      )}
      placeholderTextColor={placeholderTextColor || 'hsl(140 20% 40%)'}
      style={{
        textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto',
        includeFontPadding: false
      }}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
