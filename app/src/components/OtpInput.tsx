import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface OtpInputProps {
  length?: number;
  onCodeChanged: (code: string) => void;
  onCodeFilled?: (code: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onCodeChanged,
  onCodeFilled,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const fullCode = code.join('');
    onCodeChanged(fullCode);
    if (fullCode.length === length && !code.includes('')) {
      onCodeFilled && onCodeFilled(fullCode);
    }
  }, [code]);

  const handleChangeText = (text: string, index: number) => {
    // Handle paste
    if (text.length > 1) {
      const pastedDigits = text.replace(/[^0-9]/g, '').slice(0, length).split('');
      const newCode = [...code];
      pastedDigits.forEach((digit, idx) => {
        newCode[idx] = digit;
      });
      setCode(newCode);
      if (pastedDigits.length === length) {
        inputRefs.current[length - 1]?.focus();
      } else {
        inputRefs.current[pastedDigits.length]?.focus();
      }
      return;
    }

    const digit = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.box,
              code[index] ? styles.boxActive : null,
              index === 0 && !code[0] ? styles.boxFocused : null,
            ]}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            value={code[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
            textAlign="center"
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 24,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  boxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  boxFocused: {
    borderColor: colors.primary,
  },
});
