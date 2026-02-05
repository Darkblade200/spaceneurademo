import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';

export function PromptLabScreen() {
  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.title}>Prompt Lab</Text>
        <Text style={styles.text}>Save prompt templates, define variables, and benchmark across selected models.</Text>
        <Text style={styles.list}>• Versioned templates</Text>
        <Text style={styles.list}>• Variable sets</Text>
        <Text style={styles.list}>• One-click compare integration</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 8 },
  text: { color: colors.muted, marginBottom: 10 },
  list: { color: colors.text, marginBottom: 4 },
});
