import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ArrowLeft, MailCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { OtpInput } from '../components/OtpInput';
import { PadosiButton } from '../components/PadosiButton';
import { useAuth } from '../context/AuthContext';

export const VerifyOtpScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { verifyOtp, resendOtp, isLoading, resendCooldown, unverifiedEmail } = useAuth();
  const targetEmail = route.params?.email || unverifiedEmail || '';
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(resendCooldown || 30);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (providedCode?: string) => {
    const finalCode = (typeof providedCode === 'string' ? providedCode : code).trim();

    if (finalCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code');
      return;
    }
    setErrorMsg('');

    try {
      await verifyOtp(targetEmail, finalCode);
      navigation.navigate('Profile');
    } catch (error: any) {
      setErrorMsg(error.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setErrorMsg('');
    try {
      await resendOtp(targetEmail);
      setTimer(30);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to resend code');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Mail Icon Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <MailCheck size={40} color={colors.primary} />
          </View>
        </View>

        {/* Headings */}
        <Text style={styles.heading}>Check your inbox</Text>
        <Text style={styles.subheading}>
          We sent a 6-digit code to {'\n'}
          <Text style={styles.emailText}>{targetEmail}</Text>
        </Text>

        {/* Error Alert */}
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* 6-Digit OTP Box */}
        <OtpInput
          onCodeChanged={(newCode) => {
            setCode(newCode);
            if (newCode.length === 6) {
              setErrorMsg('');
            }
          }}
          onCodeFilled={(filledCode) => handleVerify(filledCode)}
        />

        {/* Countdown Timer Text */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Resend code in <Text style={styles.timerGold}>{formatTimer(timer)}</Text>
          </Text>
        </View>

        {/* Resend Code Button */}
        <PadosiButton
          title="Resend code"
          variant={timer === 0 ? 'secondary' : 'disabled'}
          onPress={handleResend}
          disabled={timer > 0 || isLoading}
          style={styles.resendButton}
        />

        {/* Verify Primary Button */}
        <PadosiButton
          title="Verify email"
          onPress={() => handleVerify()}
          loading={isLoading}
          style={styles.verifyButton}
        />

        {/* Change Email Footer */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.changeEmailContainer}
        >
          <Text style={styles.changeEmailText}>Change email</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },
  illustrationContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  emailText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginBottom: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timerGold: {
    color: colors.accentGold,
    fontWeight: '700',
  },
  resendButton: {
    marginBottom: 12,
  },
  verifyButton: {
    marginBottom: 20,
  },
  changeEmailContainer: {
    padding: 8,
  },
  changeEmailText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
