import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { SpringConfigs } from '../../theme/springs';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({ label, selected, onPress, style }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? Colors.light.terracotta : '#FAF8F5',
          borderColor: selected ? Colors.light.terracotta : '#E8E4DE',
          transform: [{ scale: isPressed ? SpringConfigs.tactileScale : 1 }],
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: selected ? '#FFFFFF' : Colors.light.textPrimary }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
