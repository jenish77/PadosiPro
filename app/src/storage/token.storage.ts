import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'padosipro_user_access_token';
const REFRESH_TOKEN_KEY = 'padosipro_user_refresh_token';
const USER_KEY = 'padosipro_user_data';

export const saveAccessToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    }
  } catch (e) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    }
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    return token || (await AsyncStorage.getItem(ACCESS_TOKEN_KEY));
  } catch (e) {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  }
};

export const removeAccessToken = async (): Promise<void> => {
  try {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    }
  } catch (e) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    }
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token || (await AsyncStorage.getItem(REFRESH_TOKEN_KEY));
  } catch (e) {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }
};

export const removeRefreshToken = async (): Promise<void> => {
  try {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await Promise.all([saveAccessToken(accessToken), saveRefreshToken(refreshToken)]);
};

export const removeTokens = async (): Promise<void> => {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
};

// Aliases for backward compatibility
export const saveToken = saveAccessToken;
export const getToken = getAccessToken;
export const removeToken = removeTokens;

export const saveUserData = async (userData: any): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = async (): Promise<any | null> => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeUserData = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_KEY);
};
