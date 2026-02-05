import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChatScreen } from './src/screens/ChatScreen';
import { CompareScreen } from './src/screens/CompareScreen';
import { OCRScreen } from './src/screens/OCRScreen';
import { PromptLabScreen } from './src/screens/PromptLabScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { colors } from './src/theme/colors';

type TabKey = 'chat' | 'compare' | 'ocr' | 'lab' | 'settings';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'chat', label: 'Chat' },
  { key: 'compare', label: 'Compare' },
  { key: 'ocr', label: 'OCR' },
  { key: 'lab', label: 'Prompt Lab' },
  { key: 'settings', label: 'Settings' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');

  const content = useMemo(() => {
    switch (activeTab) {
      case 'chat':
        return <ChatScreen />;
      case 'compare':
        return <CompareScreen />;
      case 'ocr':
        return <OCRScreen />;
      case 'lab':
        return <PromptLabScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Neura One</Text>
        <Text style={styles.subtitle}>Multimodal AI Workspace</Text>
      </View>
      <View style={styles.content}>{content}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const selected = tab.key === activeTab;
          return (
            <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.tabItem}>
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  tabBar: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.panel,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  tabLabelSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
});
