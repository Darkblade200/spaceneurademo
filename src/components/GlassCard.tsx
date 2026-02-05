import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function GlassCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panelSoft,
    borderRadius: 14,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12,
  },
});
