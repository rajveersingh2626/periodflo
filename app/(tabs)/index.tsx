import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { PhaseRing } from '../../src/components/calendar/PhaseRing';
import { CalendarGrid } from '../../src/components/calendar/CalendarGrid';
import { QuickLogModal } from '../../src/components/logging/QuickLogModal';
import { TactileButton } from '../../src/components/ui/TactileButton';
import { PeriodCycle, DailyLog, CyclePrediction, CyclePhase } from '../../src/types/cycle';
import { PredictiveEngine } from '../../src/services/predictions/engine';
import { dbService } from '../../src/services/storage/db';
import { SUHANI_CYCLES } from '../../src/services/storage/suhaniData';
import { PlusCircle, Users, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PWAInstallBanner } from '../../src/components/ui/PWAInstallBanner';
import { AccountSwitcherModal } from '../../src/components/account/AccountSwitcherModal';
import { WelcomeLoginScreen } from '../../src/components/account/WelcomeLoginScreen';
import { PhaseCalibrationModal } from '../../src/components/cycle/PhaseCalibrationModal';

export default function CycleHomeScreen() {
  const router = useRouter();
  const [cycles, setCycles] = useState<PeriodCycle[]>(SUHANI_CYCLES);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [prediction, setPrediction] = useState<CyclePrediction>(() =>
    PredictiveEngine.calculatePredictions(
      SUHANI_CYCLES,
      new Date().toISOString().split('T')[0]
    )
  );
  const [activeLog, setActiveLog] = useState<DailyLog | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => dbService.isLoggedIn());
  const [activeProfile, setActiveProfile] = useState(() => dbService.getUserProfile());

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setIsLoggedIn(dbService.isLoggedIn());
    const profile = dbService.getUserProfile();
    setActiveProfile(profile);

    let loadedCycles = await dbService.getCycles();
    if (loadedCycles.length === 0) {
      if (profile.id === 'suhani') {
        await dbService.seedSuhaniData();
        loadedCycles = await dbService.getCycles();
      } else {
        const starter: PeriodCycle = {
          id: `cycle-${selectedDate}`,
          startDate: selectedDate,
          endDate: selectedDate,
          periodLengthDays: profile.averagePeriodLengthDays || 5,
        };
        await dbService.saveCycle(starter);
        loadedCycles = [starter];
      }
    }
    setCycles(loadedCycles);

    const log = await dbService.getDailyLog(selectedDate);
    setActiveLog(log);

    const calculatedPrediction = PredictiveEngine.calculatePredictions(
      loadedCycles,
      selectedDate,
      log?.overridePhase,
      log?.phaseOverrideReason
    );
    setPrediction(calculatedPrediction);
  };

  const handleSaveLog = async (log: DailyLog) => {
    await dbService.saveDailyLog(log);
    setActiveLog(log);

    // If flow is logged as period start, dynamically recalculate cycles
    if (log.flowIntensity && log.flowIntensity !== 'none' && log.flowIntensity !== 'spotting') {
      const existingCycle = cycles.find((c) => c.startDate === log.date);
      if (!existingCycle) {
        const newCycle: PeriodCycle = {
          id: `cycle-${log.date}`,
          startDate: log.date,
          endDate: log.date,
          periodLengthDays: activeProfile.averagePeriodLengthDays || 5,
        };
        await dbService.saveCycle(newCycle);
        await loadData();
      }
    }
  };

  const handleSaveCalibration = async (phase: CyclePhase | null, reason?: string) => {
    let currentLog = await dbService.getDailyLog(selectedDate);
    if (!currentLog) {
      currentLog = {
        id: `log-${selectedDate}`,
        date: selectedDate,
        symptoms: [],
        moods: [],
      };
    }
    if (phase) {
      currentLog.overridePhase = phase;
      currentLog.phaseOverrideReason = reason;

      if (phase === 'menstrual') {
        const existingCycle = cycles.find((c) => c.startDate === selectedDate);
        if (!existingCycle) {
          const newCycle: PeriodCycle = {
            id: `cycle-${selectedDate}`,
            startDate: selectedDate,
            endDate: selectedDate,
            periodLengthDays: activeProfile.averagePeriodLengthDays || 5,
          };
          await dbService.saveCycle(newCycle);
        }
      }
    } else {
      delete currentLog.overridePhase;
      delete currentLog.phaseOverrideReason;
    }
    await dbService.saveDailyLog(currentLog);
    await loadData();
  };

  const effectivePhase = activeLog?.overridePhase || prediction.currentPhase;

  if (!isLoggedIn) {
    return (
      <>
        <WelcomeLoginScreen
          onLoginSuccess={loadData}
          onOpenCreate={() => setIsAccountModalOpen(true)}
        />
        <AccountSwitcherModal
          visible={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          onProfileChanged={loadData}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appName}>PeriodFLO</Text>
            <TouchableOpacity
              onPress={() => setIsAccountModalOpen(true)}
              style={styles.profilePill}
              activeOpacity={0.7}
            >
              <View style={styles.profileInitialBadge}>
                <Text style={styles.profileInitialText}>
                  {(activeProfile.name ? activeProfile.name.charAt(0) : 'U').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileName}>{activeProfile.name}</Text>
              <ChevronDown size={14} color={Colors.light.terracotta} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
            <Text style={styles.dateDisplay}>
              {new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TactileButton
            title="Partner Sync"
            variant="outline"
            icon={<Users size={16} color={Colors.light.terracotta} />}
            onPress={() => router.push('/partner')}
            style={styles.partnerBtn}
            textStyle={styles.partnerBtnText}
          />
        </View>

        {/* PWA Install Banner (Web Only) */}
        <PWAInstallBanner />

        {/* Phase Ring Hero */}
        <PhaseRing
          cycleDay={prediction.currentCycleDay}
          phase={effectivePhase}
          daysUntilNextPeriod={prediction.daysUntilNextPeriod}
          isOverridden={!!activeLog?.overridePhase}
          onPressCalibrate={() => setIsCalibrationModalOpen(true)}
        />

        {/* Quick Log Action Bar */}
        <View style={styles.logPromptCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.logPromptTitle}>Daily Check-in</Text>
            <Text style={styles.logPromptSub}>
              {activeLog
                ? `Logged: ${activeLog.flowIntensity || 'No'} flow, ${activeLog.symptoms.length} symptoms`
                : 'Log flow, symptoms, mood, and BBT'}
            </Text>
          </View>
          <TactileButton
            title={activeLog ? 'Edit' : 'Log'}
            variant="primary"
            icon={<PlusCircle size={18} color="#FFFFFF" />}
            onPress={() => setIsLogModalOpen(true)}
            style={styles.logButton}
          />
        </View>

        {/* Interactive Predictive Calendar */}
        <Text style={styles.calendarSectionTitle}>Cycle Calendar</Text>
        <CalendarGrid
          currentMonth={new Date(selectedDate)}
          cycles={cycles}
          prediction={prediction}
          selectedDate={selectedDate}
          onSelectDate={(d) => setSelectedDate(d)}
        />
      </ScrollView>

      {/* Quick Log Bottom Sheet Modal */}
      <QuickLogModal
        visible={isLogModalOpen}
        date={selectedDate}
        existingLog={activeLog}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveLog}
      />

      {/* Account & Profile Switcher Modal */}
      <AccountSwitcherModal
        visible={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onProfileChanged={loadData}
      />

      {/* Phase Calibration Modal */}
      <PhaseCalibrationModal
        visible={isCalibrationModalOpen}
        currentPhase={prediction.currentPhase}
        currentCycleDay={prediction.currentCycleDay}
        initialOverriddenPhase={activeLog?.overridePhase}
        initialReason={activeLog?.phaseOverrideReason}
        onClose={() => setIsCalibrationModalOpen(false)}
        onSaveCalibration={handleSaveCalibration}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.terracotta,
    letterSpacing: -0.5,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EE',
    borderWidth: 1,
    borderColor: '#F8D7CC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 3,
    marginBottom: 2,
  },
  profileInitialBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  profileInitialText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.terracotta,
  },
  userGreeting: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: 1,
  },
  dateDisplay: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  partnerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  partnerBtnText: {
    fontSize: 13,
  },
  logPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  logPromptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  logPromptSub: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  logButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  calendarSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: 14,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
});
