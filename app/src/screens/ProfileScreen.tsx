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
import { ArrowLeft, User as UserIcon, MapPin, Building, Home, Phone } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { PadosiInput } from '../components/PadosiInput';
import { PadosiButton } from '../components/PadosiButton';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { saveProfile, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [societyBuilding, setSocietyBuilding] = useState('');
  const [flatUnit, setFlatUnit] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    let isValid = true;
    setNameError('');
    setAddressError('');
    setMobileError('');
    setServerError('');

    if (!name.trim()) {
      setNameError('Full name is required');
      isValid = false;
    }

    if (!address.trim()) {
      setAddressError('Address & area is required');
      isValid = false;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      setMobileError('Mobile number is required');
      isValid = false;
    } else if (cleanMobile.length !== 10) {
      setMobileError('Please enter a valid 10-digit Indian mobile number');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await saveProfile({
        name: name.trim(),
        address: address.trim(),
        societyBuilding: societyBuilding.trim() || undefined,
        flatUnit: flatUnit.trim() || undefined,
        mobileNumber: mobileNumber.trim(),
        businessName: businessName.trim() || undefined,
      });
      navigation.navigate('ChooseTasks');
    } catch (error: any) {
      setServerError(error.message || 'Failed to save details. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Bar */}
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
        {/* Headings */}
        <View style={styles.heroSection}>
          <Text style={styles.heading}>A few details</Text>
          <Text style={styles.subheading}>
            So your Lifestyle Manager can coordinate visits and deliveries smoothly.
          </Text>
        </View>

        {/* Error Alert */}
        {serverError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        ) : null}

        {/* Inputs */}
        <View style={styles.formContainer}>
          <PadosiInput
            placeholder="As you would like us to use"
            label="Full name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<UserIcon size={20} color={colors.textSecondary} />}
          />

          <PadosiInput
            placeholder="Road, area, landmark"
            label="Address & area"
            value={address}
            onChangeText={setAddress}
            error={addressError}
            leftIcon={<MapPin size={20} color={colors.textSecondary} />}
          />

          <PadosiInput
            placeholder="Name as on the gate"
            label="Society / building (optional)"
            value={societyBuilding}
            onChangeText={setSocietyBuilding}
            leftIcon={<Building size={20} color={colors.textSecondary} />}
          />

          <PadosiInput
            placeholder="Enter flat / unit number"
            label="Flat / unit (optional)"
            value={flatUnit}
            onChangeText={setFlatUnit}
            leftIcon={<Home size={20} color={colors.textSecondary} />}
          />

          <PadosiInput
            placeholder="Mobile number (10 digits)"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
            prefix="+91"
            error={mobileError}
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
          />

          <PadosiButton
            title="Continue"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
  },
  locationBadge: {
    backgroundColor: colors.accentGoldLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentGold,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 16,
  },
});
