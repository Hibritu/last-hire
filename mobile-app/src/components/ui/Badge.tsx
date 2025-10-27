import * as React from "react";
import { Text, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "flex-row items-center rounded-full border px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      <Text className="text-xs font-semibold">{children}</Text>
    </View>
  );
}

export { Badge, badgeVariants };
