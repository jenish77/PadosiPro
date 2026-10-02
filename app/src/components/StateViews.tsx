import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AlertCircle, Inbox } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { PadosiButton } from './PadosiButton';

export const LoadingView: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

export const ErrorView: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <View style={styles.centerContainer}>
    <AlertCircle size={48} color={colors.error} />
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    {onRetry ? (
      <PadosiButton
        title="Try again"
        variant="primary"
        onPress={onRetry}
        style={styles.retryButton}
      />
    ) : null}
  </View>
);

export const EmptyView: React.FC<{
  title?: string;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
}> = ({
  title = 'No items found',
  message = 'There is nothing to display here right now.',
  actionTitle,
  onAction,
}) => (
  <View style={styles.centerContainer}>
    <Inbox size={48} color={colors.textMuted} />
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
    {actionTitle && onAction ? (
      <PadosiButton
        title={actionTitle}
        variant="primary"
        onPress={onAction}
        style={styles.retryButton}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 160,
  },
});
