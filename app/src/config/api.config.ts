import { Platform } from 'react-native';

// For Android emulator, 10.0.2.2 maps to host machine localhost
// For iOS simulator or web, localhost works directly
const getDefaultApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getDefaultApiUrl(),
  TIMEOUT: 10000,
};
