import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Wrench,
  Wind,
  Sparkles,
  ShieldAlert,
  Zap,
  Tv,
  ShoppingCart,
  Activity,
  Package,
  Scissors,
  CreditCard,
  UserCheck,
  Gift,
  Coffee,
  Sun,
  Camera,
  FileCheck,
  Briefcase,
  Navigation,
  Truck,
  Eye,
  Check,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  selected?: boolean;
  onToggle?: () => void;
  onPressItem?: () => void;
  variant?: 'selector' | 'home';
}

const getTaskIcon = (iconName: string, size = 22, color = colors.primary) => {
  switch (iconName) {
    case 'wind':
      return <Wind size={size} color={color} />;
    case 'wrench':
      return <Wrench size={size} color={color} />;
    case 'sparkles':
      return <Sparkles size={size} color={color} />;
    case 'shield-alert':
      return <ShieldAlert size={size} color={color} />;
    case 'zap':
      return <Zap size={size} color={color} />;
    case 'tv':
      return <Tv size={size} color={color} />;
    case 'shopping-cart':
      return <ShoppingCart size={size} color={color} />;
    case 'activity':
      return <Activity size={size} color={color} />;
    case 'package':
      return <Package size={size} color={color} />;
    case 'scissors':
      return <Scissors size={size} color={color} />;
    case 'credit-card':
      return <CreditCard size={size} color={color} />;
    case 'user-check':
      return <UserCheck size={size} color={color} />;
    case 'gift':
      return <Gift size={size} color={color} />;
    case 'coffee':
      return <Coffee size={size} color={color} />;
    case 'sun':
      return <Sun size={size} color={color} />;
    case 'camera':
      return <Camera size={size} color={color} />;
    case 'file-check':
      return <FileCheck size={size} color={color} />;
    case 'briefcase':
      return <Briefcase size={size} color={color} />;
    case 'navigation':
      return <Navigation size={size} color={color} />;
    case 'truck':
      return <Truck size={size} color={color} />;
    case 'eye':
      return <Eye size={size} color={color} />;
    default:
      return <Wrench size={size} color={color} />;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  selected = false,
  onToggle,
  onPressItem,
  variant = 'selector',
}) => {
  if (variant === 'home') {
    return (
      <TouchableOpacity
        style={styles.homeCard}
        onPress={onPressItem}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>{getTaskIcon(task.iconName, 22, colors.primary)}</View>
        <View style={styles.content}>
          <Text style={styles.title}>{task.name}</Text>
          <Text style={styles.categoryBadge}>{task.categoryName || 'Home'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.selectorCard, selected && styles.selectorCardSelected]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>{getTaskIcon(task.iconName, 24, colors.primary)}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{task.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? <Check size={16} color="#FFFFFF" strokeWidth={3} /> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FAFCFB',
  },
  homeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
