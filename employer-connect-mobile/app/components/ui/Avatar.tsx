import React from 'react';
import { View, Text, Image, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface AvatarProps extends ViewProps {
  source?: { uri: string };
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ source, alt, size = 'md', className, ...props }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  const getInitials = () => {
    if (!alt) return '?';
    const names = alt.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return alt.substring(0, 2).toUpperCase();
  };

  return (
    <View
      className={cn(
        'rounded-full overflow-hidden bg-secondary items-center justify-center',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {source?.uri ? (
        <Image
          source={source}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className={cn('font-semibold text-foreground', textSizeStyles[size])}>
          {getInitials()}
        </Text>
      )}
    </View>
  );
}

export default Avatar;


