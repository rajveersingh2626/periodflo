import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X } from 'lucide-react-native';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isStandalone, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (Platform.OS !== 'web' || isStandalone || !isInstallable || dismissed) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.iconCircle}>
        <Download size={16} color={Colors.light.terracotta} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Install PeriodFLO App</Text>
        <Text style={styles.subtitle}>Install for 100% offline access & instant launch</Text>
      </View>
      <Pressable onPress={promptInstall} style={styles.installButton}>
        <Text style={styles.installText}>Install</Text>
      </Pressable>
      <Pressable onPress={() => setDismissed(true)} style={styles.closeButton}>
        <X size={16} color={Colors.light.textMuted} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  installButton: {
    backgroundColor: Colors.light.terracotta,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  installText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
});
