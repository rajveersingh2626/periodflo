import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { SpringConfigs } from '../../theme/springs';

interface TactileButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getBackgroundColor = () => {
    if (disabled) return '#E8E4DE';
    switch (variant) {
      case 'primary':
        return Colors.light.terracotta;
      case 'secondary':
        return Colors.light.sage;
      case 'outline':
      case 'ghost':
        return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#9B958D';
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
        return Colors.light.terracotta;
      case 'ghost':
        return Colors.light.textPrimary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? Colors.light.terracotta : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          transform: [{ scale: isPressed ? SpringConfigs.tactileScale : 1 }],
        },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
