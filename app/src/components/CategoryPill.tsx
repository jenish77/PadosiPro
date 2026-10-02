import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface CategoryPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.pill, selected ? styles.pillSelected : styles.pillUnselected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  labelUnselected: {
    color: colors.textSecondary,
  },
});
