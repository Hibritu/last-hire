import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary',
        ghost: '',
        link: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  'text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-accent-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-accent-foreground',
        link: 'text-primary underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <Pressable
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <Text className={cn(buttonTextVariants({ variant }))}>
          {children}
        </Text>
      </Pressable>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
