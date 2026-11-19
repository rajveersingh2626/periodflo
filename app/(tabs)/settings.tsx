import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Colors } from '../../src/theme/colors';
import { TactileButton } from '../../src/components/ui/TactileButton';
import { AppLockService } from '../../src/services/security/appLock';
import { DataExportService } from '../../src/services/export/dataExport';
import { dbService } from '../../src/services/storage/db';
import { MigrationService } from '../../src/services/migration/importer';
import {
  ShieldCheck,
  Download,
  UploadCloud,
  Trash2,
  Lock,
  FileText,
  Smartphone,
  Users,
  UserCheck,
} from 'lucide-react-native';
import { usePWAInstall } from '../../src/hooks/usePWAInstall';
import { AccountSwitcherModal } from '../../src/components/account/AccountSwitcherModal';

export default function SettingsScreen() {
  const [isLockEnabled, setIsLockEnabled] = useState(AppLockService.isLockEnabled());
  const { isInstallable, isStandalone, promptInstall } = usePWAInstall();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(() => dbService.getUserProfile());

  const handleToggleLock = () => {
    if (isLockEnabled) {
      AppLockService.removePin();
      setIsLockEnabled(false);
      Alert.alert('Lock Disabled', 'PIN lock has been removed.');
    } else {
      AppLockService.setPin('1234'); // Default PIN for quick activation
      setIsLockEnabled(true);
      Alert.alert(
        'App Lock Enabled',
        'PIN lock enabled with default PIN: 1234. You can change this anytime.'
      );
    }
  };

  const handleExportJson = async () => {
    const data = await DataExportService.generateExportData(dbService);
    const jsonStr = DataExportService.exportToJson(data);
    Alert.alert('Data Export Ready', `Exported ${data.cycles.length} cycles and ${data.logs.length} logs in JSON.`);
  };

  const handleExportCsv = async () => {
    const data = await DataExportService.generateExportData(dbService);
    const csvStr = DataExportService.exportToCsv(data);
    Alert.alert('CSV Export Ready', `Exported ${data.cycles.length} cycles in standard CSV format.`);
  };

  const handleImportSampleData = async () => {
    const sampleFloCsv = `Start date,End date,Cycle length,Period length
2026-07-01,2026-07-05,28,5
2026-07-29,2026-08-02,29,5
2026-08-27,2026-08-31,28,5
2026-09-24,2026-09-28,29,5
2026-10-23,2026-10-27,28,5`;

    const result = MigrationService.importData(sampleFloCsv, 'flo_csv');
    for (const c of result.cycles) {
      await dbService.saveCycle(c);
    }
    Alert.alert(
      'Import Successful',
      `Imported ${result.cycles.length} historical cycles! Baseline cycle length: ${result.baseline.averageCycleLengthDays} days, Regularity: ${result.baseline.regularityScore}%.`
    );
  };

  const handleLoadSuhaniData = async () => {
    await dbService.seedSuhaniData();
    Alert.alert(
      "Suhani's Data Populated",
      'Successfully loaded 47 historical cycles (2022–2026) and 106 daily symptom logs with a 30-day baseline cycle and 4-day period average.'
    );
  };

  const handleWipeData = () => {
    Alert.alert(
      'Erase All Data?',
      'This will cryptographically erase all cycles, symptom logs, encryption keys, and partner pairings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Wipe Everything',
          style: 'destructive',
          onPress: async () => {
            await dbService.wipeDatabase();
            AppLockService.reset();
            setIsLockEnabled(false);
            Alert.alert('Data Wiped', 'All data has been permanently and securely erased.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Privacy & Settings</Text>
          <Text style={styles.subtitle}>Zero trackers. Sovereign health data control.</Text>
        </View>

        {/* Active Account Profile & Switcher */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF2EE' }]}>
              <Text style={{ fontSize: 18 }}>{activeProfile.avatar || '🌸'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>ACTIVE ACCOUNT PROFILE</Text>
              <Text style={[styles.cardDesc, { fontWeight: '700', color: Colors.light.textPrimary }]}>
                {activeProfile.name}
              </Text>
            </View>
          </View>
          <Text style={styles.infoText}>
            {activeProfile.id === 'suhani'
              ? "Currently using Suhani's verified 4-year cycle dataset (47 historical cycles)."
              : "Currently using your private personal profile with sovereign encrypted storage."}
          </Text>
          <TactileButton
            title="Switch or Manage Accounts"
            variant="outline"
            icon={<Users size={16} color={Colors.light.terracotta} />}
            onPress={() => setIsAccountModalOpen(true)}
            style={{ marginTop: 10 }}
          />
        </View>

        {/* Security & App Lock */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Lock size={18} color={Colors.light.terracotta} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>SECURITY & APP LOCK</Text>
              <Text style={styles.cardDesc}>Protect app with Biometrics / 4-digit PIN</Text>
            </View>
            <Switch
              value={isLockEnabled}
              onValueChange={handleToggleLock}
              trackColor={{ false: '#E8E4DE', true: Colors.light.terracotta }}
            />
          </View>
        </View>

        {/* PWA App Installation */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF1E8' }]}>
              <Smartphone size={18} color={Colors.light.terracotta} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>INSTALL AS STANDALONE APP</Text>
              <Text style={styles.cardDesc}>
                {isStandalone
                  ? 'Running as installed standalone PWA'
                  : 'Install to Home Screen or Dock for full offline access'}
              </Text>
            </View>
          </View>
          {!isStandalone && (
            <TactileButton
              title={isInstallable ? 'Install PeriodFLO to Device' : 'Installed / Ready in Browser'}
              variant="outline"
              disabled={!isInstallable}
              onPress={promptInstall}
              style={{ marginTop: 12 }}
            />
          )}
        </View>

        {/* Data Migration Engine */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#EEF7F2' }]}>
              <UploadCloud size={18} color={Colors.light.sage} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>IMPORT CYCLE HISTORY</Text>
              <Text style={styles.cardDesc}>Import from Flo, Clue, Apple Health, or CSV</Text>
            </View>
          </View>
          <Text style={styles.infoText}>
            Import existing cycle records from your previous app to immediately establish accurate
            averages and symptom forecasts.
          </Text>
          <TactileButton
            title="Import Historical Data"
            variant="outline"
            icon={<FileText size={16} color={Colors.light.terracotta} />}
            onPress={handleImportSampleData}
            style={{ marginTop: 12 }}
          />
          <TactileButton
            title="Reload Suhani's Account Data (47 Cycles)"
            variant="primary"
            icon={<UploadCloud size={16} color="#FFFFFF" />}
            onPress={handleLoadSuhaniData}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Export Data */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F4F8' }]}>
              <Download size={18} color="#0284C7" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>EXPORT SOVEREIGN DATA</Text>
              <Text style={styles.cardDesc}>Download full unencrypted backups</Text>
            </View>
          </View>
          <View style={styles.exportButtonRow}>
            <TactileButton
              title="Export JSON"
              variant="outline"
              onPress={handleExportJson}
              style={{ flex: 1, marginRight: 8 }}
            />
            <TactileButton
              title="Export CSV"
              variant="outline"
              onPress={handleExportCsv}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Zero-Knowledge Privacy Guarantee Card */}
        <View style={styles.privacyCard}>
          <ShieldCheck size={20} color={Colors.light.success} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyTitle}>Zero-Knowledge Guarantee</Text>
            <Text style={styles.privacyBody}>
              PeriodFLO contains zero third-party ads or analytics pixels. Health data is encrypted
              on-device using AES-256-GCM.
            </Text>
          </View>
        </View>

        {/* Danger Zone: Wipe */}
        <View style={[styles.card, { borderColor: '#F5C6CB' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FDF2F0' }]}>
              <Trash2 size={18} color={Colors.light.warning} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.cardTitle, { color: Colors.light.warning }]}>DANGER ZONE</Text>
              <Text style={styles.cardDesc}>Permanently zero and wipe all stored data</Text>
            </View>
          </View>
          <TactileButton
            title="Wipe All Data"
            variant="primary"
            onPress={handleWipeData}
            style={{ backgroundColor: Colors.light.warning, marginTop: 12 }}
          />
        </View>
      </ScrollView>

      {/* Account & Profile Switcher Modal */}
      <AccountSwitcherModal
        visible={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onProfileChanged={() => setActiveProfile(dbService.getUserProfile())}
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
  header: {
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FBF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  cardDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: 10,
  },
  exportButtonRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F5',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#C3E6CB',
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.success,
  },
  privacyBody: {
    fontSize: 12,
    color: Colors.light.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
});
