import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { DailyInsightCard } from '../../src/components/insights/DailyInsightCard';
import { WellnessCards } from '../../src/components/wellness/WellnessCards';
import { dbService } from '../../src/services/storage/db';
import { PredictiveEngine } from '../../src/services/predictions/engine';
import { InsightEngine, DailyInsightResult } from '../../src/services/insights/nlgEngine';

export default function InsightsScreen() {
  const [insight, setInsight] = useState<DailyInsightResult | null>(null);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    const today = new Date().toISOString().split('T')[0];
    const cycles = await dbService.getCycles();
    const log = await dbService.getDailyLog(today);
    const prediction = PredictiveEngine.calculatePredictions(cycles, today);

    const generated = InsightEngine.generateDailyInsight({
      cycleDay: prediction.currentCycleDay,
      phase: prediction.currentPhase,
      symptoms: log?.symptoms || [],
      energyLevel: log?.energyLevel || 3,
      sleepQuality: log?.sleepQuality || 4,
    });

    setInsight(generated);
  };

  if (!insight) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Intelligence</Text>
          <Text style={styles.subtitle}>
            Physiologically grounded forecasts tuned to your body
          </Text>
        </View>

        <DailyInsightCard insight={insight} />
        <WellnessCards tips={insight.wellnessTips} />
      </ScrollView>
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
