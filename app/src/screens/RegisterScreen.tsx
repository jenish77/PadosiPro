import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Mail, Lock, Building2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { PadosiInput } from '../components/PadosiInput';
import { PadosiButton } from '../components/PadosiButton';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setServerError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register(email.trim(), password);
      navigation.navigate('VerifyOtp', { email: email.trim() });
    } catch (error: any) {
      setServerError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Decorative Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.logoTitle}>
              Padosi<Text style={styles.logoGold}>Pro</Text>
            </Text>
            <Text style={styles.logoSubtitle}>Your Lifestyle Partner</Text>
          </View>
          <View style={styles.headerIllustration}>
            <Building2 size={40} color={colors.primary} />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heading}>Make life easier</Text>
          <Text style={styles.subheading}>
            One trusted Lifestyle Manager for your everyday needs.
          </Text>
        </View>

        {/* Server Error Alert */}
        {serverError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        ) : null}

        {/* Registration Form */}
        <View style={styles.formContainer}>
          <PadosiInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            error={emailError}
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />

          <PadosiInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
            helperText="At least 8 characters"
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />

          <PadosiInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />

          <PadosiButton
            title="Create account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  logoGold: {
    color: colors.accentGold,
  },
  logoSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  headerIllustration: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
