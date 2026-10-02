import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '../storage/token.storage';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor to inject JWT Access Token into requests
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized and auto-refresh access token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = await getRefreshToken();
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { timeout: API_CONFIG.TIMEOUT }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.data) {
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
          await saveTokens(accessToken, newRefreshToken);

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh token response invalid');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await removeTokens();
        return Promise.reject({
          message: 'Session expired. Please sign in again.',
          status: 401,
          data: error.response?.data,
        });
      } finally {
        isRefreshing = false;
      }
    }

    let message = 'An unexpected error occurred. Please check your network connection.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);
