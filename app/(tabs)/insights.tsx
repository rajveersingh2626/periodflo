import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { DailyInsightCard } from '../../src/components/insights/DailyInsightCard';
import { WellnessCards } from '../../src/components/wellness/WellnessCards';
import { dbService } from '../../src/services/storage/db';
import { PredictiveEngine } from '../../src/services/predictions/engine';
import { InsightEngine, DailyInsightResult } from '../../src/services/insights/nlgEngine';
import { SUHANI_CYCLES } from '../../src/services/storage/suhaniData';
import { PhaseCalibrationModal } from '../../src/components/cycle/PhaseCalibrationModal';
import { CyclePhase, DailyLog, CyclePrediction } from '../../src/types/cycle';

export default function InsightsScreen() {
  const [insight, setInsight] = useState<DailyInsightResult>(() => {
    const today = new Date().toISOString().split('T')[0];
    const initialPred = PredictiveEngine.calculatePredictions(SUHANI_CYCLES, today);
    return InsightEngine.generateDailyInsight({
      cycleDay: initialPred.currentCycleDay,
      phase: initialPred.currentPhase,
      symptoms: ['cravings'],
      energyLevel: 3,
      sleepQuality: 4,
    });
  });

  const [prediction, setPrediction] = useState<CyclePrediction>(() => {
    const today = new Date().toISOString().split('T')[0];
    return PredictiveEngine.calculatePredictions(SUHANI_CYCLES, today);
  });

  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    let cycles = await dbService.getCycles();
    if (cycles.length === 0) {
      await dbService.seedSuhaniData();
      cycles = await dbService.getCycles();
    }
    const today = new Date().toISOString().split('T')[0];
    const log = await dbService.getDailyLog(today);
    setDailyLog(log);

    const calculatedPred = PredictiveEngine.calculatePredictions(cycles, today);
    setPrediction(calculatedPred);

    const effectivePhase: CyclePhase = log?.overridePhase || calculatedPred.currentPhase;

    const generated = InsightEngine.generateDailyInsight({
      cycleDay: calculatedPred.currentCycleDay,
      phase: effectivePhase,
      symptoms: log?.symptoms || [],
      energyLevel: log?.energyLevel || 3,
      sleepQuality: log?.sleepQuality || 4,
    });

    setInsight(generated);
  };

  const handleSaveCalibration = async (phase: CyclePhase | null, reason?: string) => {
    const today = new Date().toISOString().split('T')[0];
    let currentLog = await dbService.getDailyLog(today);
    if (!currentLog) {
      currentLog = {
        id: `log-${today}`,
        date: today,
        symptoms: [],
        moods: [],
      };
    }
    if (phase) {
      currentLog.overridePhase = phase;
      currentLog.phaseOverrideReason = reason;
    } else {
      delete currentLog.overridePhase;
      delete currentLog.phaseOverrideReason;
    }
    await dbService.saveDailyLog(currentLog);
    await loadInsight();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Intelligence</Text>
          <Text style={styles.subtitle}>
            Physiologically grounded forecasts tuned to your body
          </Text>
        </View>

        <DailyInsightCard
          insight={insight}
          isOverridden={!!dailyLog?.overridePhase}
          calibrationReason={dailyLog?.phaseOverrideReason}
          onPressCalibrate={() => setIsCalibrationModalOpen(true)}
        />
        <WellnessCards tips={insight.wellnessTips} />
      </ScrollView>

      <PhaseCalibrationModal
        visible={isCalibrationModalOpen}
        currentPhase={prediction.currentPhase}
        currentCycleDay={prediction.currentCycleDay}
        initialOverriddenPhase={dailyLog?.overridePhase}
        initialReason={dailyLog?.phaseOverrideReason}
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
});
