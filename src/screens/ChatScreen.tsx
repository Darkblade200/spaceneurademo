import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MotiView } from 'moti';
import { GlassCard } from '../components/GlassCard';
import { useChatStore } from '../state/chatStore';
import { colors } from '../theme/colors';

export function ChatScreen() {
  const {
    messages,
    input,
    routerMode,
    privacyModeLocalOnly,
    isStreaming,
    setInput,
    setRouterMode,
    setPrivacyModeLocalOnly,
    sendMessage,
  } = useChatStore();

  return (
    <View style={styles.container}>
      <GlassCard>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Auto Router</Text>
          <Switch value={routerMode === 'auto'} onValueChange={(v) => setRouterMode(v ? 'auto' : 'manual')} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Local Privacy Mode</Text>
          <Switch value={privacyModeLocalOnly} onValueChange={setPrivacyModeLocalOnly} />
        </View>
      </GlassCard>

      <ScrollView style={styles.messages} contentContainerStyle={{ gap: 8 }}>
        {messages.map((msg, index) => (
          <MotiView
            key={msg.id}
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 240, delay: index * 40 }}
            style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}
          >
            <Text style={styles.bubbleText}>{msg.text || (msg.role === 'assistant' ? '...' : '')}</Text>
            {msg.model && <Text style={styles.meta}>Model: {msg.model}</Text>}
            {msg.usage && (
              <Text style={styles.meta}>
                Usage: {msg.usage.inputTokens + msg.usage.outputTokens} tokens · ${msg.usage.estimatedUsd.toFixed(4)}
              </Text>
            )}
          </MotiView>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Ask anything..."
          placeholderTextColor={colors.muted}
          value={input}
          onChangeText={setInput}
          style={styles.input}
          editable={!isStreaming}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={isStreaming}>
          <Text style={styles.sendLabel}>{isStreaming ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { color: colors.text, fontSize: 14 },
  messages: { flex: 1 },
  bubble: { borderRadius: 10, padding: 10 },
  userBubble: { backgroundColor: '#27325D' },
  assistantBubble: { backgroundColor: colors.panel },
  bubbleText: { color: colors.text, fontSize: 14 },
  meta: { color: colors.muted, marginTop: 6, fontSize: 11 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendBtn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  sendLabel: { color: '#FFFFFF', fontWeight: '700' },
});
