import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export default function LuxuryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'solid',
  style,
}: Props) {
  const isSolid = variant === 'solid';
  return (
    <TouchableOpacity
      style={[styles.base, isSolid ? styles.solid : styles.outline, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isSolid ? theme.colors.background : theme.colors.text}
        />
      ) : (
        <Text style={[styles.label, !isSolid && styles.labelOutline]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: theme.colors.text,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.text,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    color: theme.colors.background,
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '500',
  },
  labelOutline: {
    color: theme.colors.text,
  },
});
