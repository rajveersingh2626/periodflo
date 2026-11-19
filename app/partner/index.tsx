import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../src/theme/colors';
import { PartnerHero } from '../../src/components/partner/PartnerHero';
import { EmpathyCard } from '../../src/components/partner/EmpathyCard';
import { PartnerSharingModal } from '../../src/components/partner/PartnerSharingModal';
import { TactileButton } from '../../src/components/ui/TactileButton';
import { PartnerPayload, SharedPermissions, E2EESyncService } from '../../src/services/sync/e2ee';
import { PairingService } from '../../src/services/sync/pairing';
import { LocalNotificationScheduler, DiscreetAlert } from '../../src/services/notifications/localScheduler';
import { relayServer } from '../../server/src/index';
import { ArrowLeft, Sliders, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PartnerModeScreen() {
  const router = useRouter();

  // Primary user sharing settings state
  const [pairingCode] = useState('7K9X2P');
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<SharedPermissions>({
    sharePhase: true,
    shareCountdown: true,
    shareEnergyAndMood: true,
    shareSymptoms: true,
  });

  // Partner view state
  const [isPaired, setIsPaired] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [scheduledAlerts, setScheduledAlerts] = useState<DiscreetAlert[]>([]);

  // Simulated live E2EE decrypted payload for partner view
  const [partnerPayload, setPartnerPayload] = useState<PartnerPayload>({
    cycleDay: 22,
    phase: 'luteal',
    countdownDays: 6,
    energyForecast: 'Gentle, introspective energy',
    symptoms: ['cramps', 'fatigue'],
    empathyTip:
      'Her progesterone is peaking. Keep dinner simple, offer a cozy night in, and run a warm bath or prepare a heating pad unprompted.',
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Schedule discreet local notifications for the partner
    if (notificationsEnabled) {
      const alerts = LocalNotificationScheduler.calculateDiscreetAlerts(partnerPayload);
      setScheduledAlerts(alerts);
    } else {
      setScheduledAlerts([]);
    }
  }, [partnerPayload, notificationsEnabled]);

  const handlePairSubmit = () => {
    if (inputCode.trim().length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-character pairing code.');
      return;
    }
    setIsPaired(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Navigation */}
        <View style={styles.headerRow}>
          <TactileButton
            title="Back"
            variant="ghost"
            icon={<ArrowLeft size={18} color={Colors.light.textPrimary} />}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Partner View</Text>
          <TactileButton
            title="Share"
            variant="ghost"
            icon={<Sliders size={18} color={Colors.light.terracotta} />}
            onPress={() => setIsSharingModalOpen(true)}
            style={styles.settingsButton}
          />
        </View>

        {!isPaired ? (
          // Unpaired state: Enter code
          <View style={styles.pairingContainer}>
            <Text style={styles.pairingTitle}>Connect to Partner</Text>
            <Text style={styles.pairingSubtitle}>
              Ask your partner for her 6-character invite code to establish an end-to-end encrypted
              connection.
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="e.g. 7K9X2P"
              placeholderTextColor={Colors.light.textMuted}
              autoCapitalize="characters"
              maxLength={6}
              value={inputCode}
              onChangeText={setInputCode}
            />

            <TactileButton
              title="Pair Device"
              variant="primary"
              onPress={handlePairSubmit}
              style={{ width: '100%', marginTop: 14 }}
            />
          </View>
        ) : (
          // Paired state: Hero Dashboard & Support Tips
          <>
            <PartnerHero payload={partnerPayload} />

            <EmpathyCard
              tip={partnerPayload.empathyTip}
              symptoms={permissions.shareSymptoms ? partnerPayload.symptoms : []}
            />

            {/* Discreet Alerts Card */}
            <View style={styles.alertsCard}>
              <View style={styles.alertsHeader}>
                <View style={styles.bellBadge}>
                  <Bell size={16} color={Colors.light.terracotta} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertsTitle}>DISCREET SHIFT NOTIFICATIONS</Text>
                  <Text style={styles.alertsSubtitle}>
                    {notificationsEnabled
                      ? `${scheduledAlerts.length} quiet reminders scheduled on this device`
                      : 'Notifications paused'}
                  </Text>
                </View>
              </View>

              {scheduledAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <Text style={styles.alertDate}>{alert.date}</Text>
                  <Text style={styles.alertBody}>{alert.body}</Text>
                </View>
              ))}

              <TactileButton
                title={notificationsEnabled ? 'Pause Alerts' : 'Enable Discreet Alerts'}
                variant="outline"
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                style={{ marginTop: 12 }}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Primary Sharing Settings Modal */}
      <PartnerSharingModal
        visible={isSharingModalOpen}
        pairingCode={pairingCode}
        permissions={permissions}
        onUpdatePermissions={setPermissions}
        onClose={() => setIsSharingModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  settingsButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pairingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginTop: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  pairingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: -0.3,
  },
  pairingSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  codeInput: {
    width: '100%',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 16,
    paddingVertical: 14,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 6,
    color: Colors.light.terracotta,
  },
  alertsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 10,
    marginBottom: 30,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bellBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  alertsSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  alertItem: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0ECE6',
  },
  alertDate: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.terracotta,
  },
  alertBody: {
    fontSize: 12,
    color: Colors.light.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
});
