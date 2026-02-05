import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';

export function OCRScreen() {
  const [engine, setEngine] = useState<'tesseract' | 'paddleocr'>('tesseract');

  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.title}>OCR Scan</Text>
        <Text style={styles.text}>Capture an image or import from gallery, then extract text with your selected engine.</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.pill, engine === 'tesseract' && styles.pillActive]} onPress={() => setEngine('tesseract')}>
            <Text style={styles.pillText}>Tesseract</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pill, engine === 'paddleocr' && styles.pillActive]} onPress={() => setEngine('paddleocr')}>
            <Text style={styles.pillText}>PaddleOCR</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.meta}>Current engine: {engine}</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 8 },
  text: { color: colors.muted, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  pill: { backgroundColor: colors.panel, borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8 },
  pillActive: { borderColor: colors.accent },
  pillText: { color: colors.text, fontSize: 12 },
  meta: { color: colors.success, marginTop: 10 },
});
