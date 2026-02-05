import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { useChatStore } from '../state/chatStore';
import { colors } from '../theme/colors';

export function SettingsScreen() {
  const { privacyModeLocalOnly, setPrivacyModeLocalOnly } = useChatStore();

  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Local inference only (Ollama / LM Studio)</Text>
          <Switch value={privacyModeLocalOnly} onValueChange={setPrivacyModeLocalOnly} />
        </View>
        <Text style={styles.meta}>Usage transparency and per-model limits panel would be shown here.</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  text: { color: colors.text, flex: 1 },
  meta: { color: colors.muted, marginTop: 10 },
});
