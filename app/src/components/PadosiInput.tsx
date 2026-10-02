import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface PadosiInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  prefix?: string;
  helperText?: string;
}

export const PadosiInput: React.FC<PadosiInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  prefix,
  helperText,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {prefix ? (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        ) : null}

        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconRight}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {helperText && !error ? <Text style={styles.helperText}>{helperText}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  prefixContainer: {
    paddingRight: 10,
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    padding: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    height: '100%',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    fontWeight: '500',
  },
});
