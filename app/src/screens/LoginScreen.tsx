import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Mail, Lock, Armchair } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { PadosiInput } from '../components/PadosiInput';
import { PadosiButton } from '../components/PadosiButton';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
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
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const result = await login(email.trim(), password);

      if (result?.isVerified === false) {
        navigation.navigate('VerifyOtp', { email: email.trim() });
      } else if (result?.isVerified === true) {
        if (!result.user?.hasCompletedProfile) {
          navigation.navigate('Profile');
        } else {
          navigation.navigate('Home');
        }
      }
    } catch (error: any) {
      setServerError(error.message || 'Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Header Branding */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.logoTitle}>
              Padosi<Text style={styles.logoGold}>Pro</Text>
            </Text>
            <Text style={styles.logoSubtitle}>Your Lifestyle Partner</Text>
          </View>
          <View style={styles.headerIllustration}>
            <Armchair size={36} color={colors.primary} />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Your day, made simpler.</Text>
        </View>

        {/* Server Error Alert */}
        {serverError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        ) : null}

        {/* Form Inputs */}
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
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />

          <PadosiButton
            title="Log in"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>New to PadosiPro? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Create account</Text>
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
    marginBottom: 36,
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
    marginBottom: 28,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
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
    marginTop: 16,
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
