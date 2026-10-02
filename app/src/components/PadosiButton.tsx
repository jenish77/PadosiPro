import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';

interface PadosiButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const PadosiButton: React.FC<PadosiButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  onPress,
  ...props
}) => {
  const isButtonDisabled = disabled || loading || variant === 'disabled';

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'disabled':
        return styles.disabledButton;
      default:
        return isButtonDisabled ? styles.disabledButton : styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'disabled':
        return styles.disabledText;
      default:
        return isButtonDisabled ? styles.disabledText : styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.buttonBase, getButtonStyle(), style]}
      disabled={isButtonDisabled}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.textBase, getTextStyle(), textStyle, icon ? { marginLeft: 8 } : null]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.disabledText,
  },
});
