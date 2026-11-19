import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Switch, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { SharedPermissions } from '../../services/sync/e2ee';
import { TactileButton } from '../ui/TactileButton';
import { QrCode, KeyRound, ShieldAlert } from 'lucide-react-native';

interface PartnerSharingModalProps {
  visible: boolean;
  pairingCode: string;
  permissions: SharedPermissions;
  onUpdatePermissions: (perms: SharedPermissions) => void;
  onClose: () => void;
}

export const PartnerSharingModal: React.FC<PartnerSharingModalProps> = ({
  visible,
  pairingCode,
  permissions,
  onUpdatePermissions,
  onClose,
}) => {
  const togglePermission = (key: keyof SharedPermissions) => {
    onUpdatePermissions({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />
          <Text style={styles.sheetTitle}>Partner Sharing & Privacy</Text>
          <Text style={styles.sheetSubtitle}>
            Zero-Knowledge: You choose exactly what is encrypted and shared.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pairing Code Card */}
            <View style={styles.codeCard}>
              <View style={styles.codeHeader}>
                <KeyRound size={16} color={Colors.light.terracotta} />
                <Text style={styles.codeLabel}>YOUR 6-CHARACTER PAIRING CODE</Text>
              </View>
              <Text style={styles.codeText}>{pairingCode}</Text>
              <Text style={styles.codeHint}>
                Valid for 10 minutes. Tell your partner to enter this code on their app.
              </Text>
            </View>

            {/* Granular Privacy Toggles */}
            <Text style={styles.sectionHeader}>DATA SHARING PERMISSIONS</Text>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.toggleTitle}>Cycle Day & Hormonal Phase</Text>
                <Text style={styles.toggleDesc}>
                  Allows partner to see current phase (e.g. Follicular, Luteal).
                </Text>
              </View>
              <Switch
                value={permissions.sharePhase}
                onValueChange={() => togglePermission('sharePhase')}
                trackColor={{ false: '#E8E4DE', true: Colors.light.terracotta }}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.toggleTitle}>Period Countdown</Text>
                <Text style={styles.toggleDesc}>
                  Displays days until next period (e.g. ~4 days).
                </Text>
              </View>
              <Switch
                value={permissions.shareCountdown}
                onValueChange={() => togglePermission('shareCountdown')}
                trackColor={{ false: '#E8E4DE', true: Colors.light.terracotta }}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.toggleTitle}>Energy & Support Tips</Text>
                <Text style={styles.toggleDesc}>
                  Shares daily actionable empathy recommendations and energy level.
                </Text>
              </View>
              <Switch
                value={permissions.shareEnergyAndMood}
                onValueChange={() => togglePermission('shareEnergyAndMood')}
                trackColor={{ false: '#E8E4DE', true: Colors.light.terracotta }}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.toggleTitle}>Physical Symptoms</Text>
                <Text style={styles.toggleDesc}>
                  Shares common symptoms (cramps, fatigue, headaches).
                </Text>
              </View>
              <Switch
                value={permissions.shareSymptoms}
                onValueChange={() => togglePermission('shareSymptoms')}
                trackColor={{ false: '#E8E4DE', true: Colors.light.terracotta }}
              />
            </View>

            {/* Never Shared Notice */}
            <View style={styles.neverSharedNotice}>
              <ShieldAlert size={16} color={Colors.light.textMuted} />
              <Text style={styles.neverSharedText}>
                Flow details, custom personal notes, and sexual health are strictly private and
                never synced.
              </Text>
            </View>

            <TactileButton
              title="Done"
              variant="primary"
              onPress={onClose}
              style={{ marginVertical: 20 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  handleBar: {
    width: 44,
    height: 5,
    backgroundColor: '#E0DDD7',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: -0.4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  codeCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginBottom: 16,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 1,
  },
  codeText: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.light.terracotta,
    letterSpacing: 6,
    fontFamily: 'monospace',
    marginVertical: 4,
  },
  codeHint: {
    fontSize: 11,
    color: Colors.light.textMuted,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE6',
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  toggleDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  neverSharedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF8F5',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  neverSharedText: {
    fontSize: 11,
    color: Colors.light.textMuted,
    flex: 1,
    lineHeight: 15,
  },
});
