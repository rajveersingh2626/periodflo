import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { PhaseRing } from '../../src/components/calendar/PhaseRing';
import { CalendarGrid } from '../../src/components/calendar/CalendarGrid';
import { QuickLogModal } from '../../src/components/logging/QuickLogModal';
import { TactileButton } from '../../src/components/ui/TactileButton';
import { PeriodCycle, DailyLog, CyclePrediction } from '../../src/types/cycle';
import { PredictiveEngine } from '../../src/services/predictions/engine';
import { dbService } from '../../src/services/storage/db';
import { PlusCircle, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PWAInstallBanner } from '../../src/components/ui/PWAInstallBanner';

export default function CycleHomeScreen() {
  const router = useRouter();
  const [cycles, setCycles] = useState<PeriodCycle[]>([]);
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeLog, setActiveLog] = useState<DailyLog | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    let loadedCycles = await dbService.getCycles();
    if (loadedCycles.length === 0) {
      // Seed default baseline cycle for seamless day-one experience
      const initialCycle: PeriodCycle = {
        id: 'c-init',
        startDate: '2026-11-01',
        endDate: '2026-11-05',
        cycleLengthDays: 28,
        periodLengthDays: 5,
      };
      await dbService.saveCycle(initialCycle);
      loadedCycles = [initialCycle];
    }
    setCycles(loadedCycles);

    const calculatedPrediction = PredictiveEngine.calculatePredictions(
      loadedCycles,
      selectedDate
    );
    setPrediction(calculatedPrediction);

    const log = await dbService.getDailyLog(selectedDate);
    setActiveLog(log);
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
          periodLengthDays: 5,
        };
        await dbService.saveCycle(newCycle);
        await loadData();
      }
    }
  };

  if (!prediction) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appName}>PeriodFLO</Text>
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
          phase={prediction.currentPhase}
          daysUntilNextPeriod={prediction.daysUntilNextPeriod}
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
