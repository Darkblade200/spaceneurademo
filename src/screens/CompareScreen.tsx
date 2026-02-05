import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { topCandidates } from '../services/router';
import { colors } from '../theme/colors';

export function CompareScreen() {
  const [prompt, setPrompt] = useState('Summarize this architecture in 5 bullets.');
  const [ran, setRan] = useState(false);

  const candidates = useMemo(
    () => topCandidates({ task: 'chat', preferLowLatency: true, preferLowCost: true, privacyModeLocalOnly: false }, 3),
    [],
  );

  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.title}>Multi-model Compare</Text>
        <TextInput value={prompt} onChangeText={setPrompt} style={styles.input} placeholderTextColor={colors.muted} />
        <TouchableOpacity style={styles.button} onPress={() => setRan(true)}>
          <Text style={styles.buttonLabel}>Run Compare</Text>
        </TouchableOpacity>
      </GlassCard>

      <ScrollView contentContainerStyle={{ gap: 10 }}>
        {candidates.map((model) => (
          <GlassCard key={model.id}>
            <Text style={styles.cardTitle}>{model.displayName}</Text>
            <Text style={styles.meta}>Provider: {model.provider}</Text>
            <Text style={styles.meta}>Latency: ~{model.avgLatencyMs}ms</Text>
            <Text style={styles.answer}>
              {ran ? `Mock answer from ${model.id} for prompt: "${prompt}"` : 'Run compare to generate result.'}
            </Text>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 10 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  button: { marginTop: 10, backgroundColor: colors.accent, borderRadius: 10, padding: 10, alignItems: 'center' },
  buttonLabel: { color: '#fff', fontWeight: '700' },
  cardTitle: { color: colors.text, fontWeight: '700', marginBottom: 6 },
  meta: { color: colors.muted, fontSize: 12 },
  answer: { color: colors.text, marginTop: 8 },
});
