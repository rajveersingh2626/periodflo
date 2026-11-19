import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { CycleAnalytics } from '../../src/components/analytics/CycleAnalytics';
import { dbService } from '../../src/services/storage/db';
import { MigrationService } from '../../src/services/migration/importer';
import { PeriodCycle, DailyLog, CycleBaseline } from '../../src/types/cycle';
import {
  SUHANI_CYCLES,
  SUHANI_LOGS,
  SUHANI_BASELINE,
} from '../../src/services/storage/suhaniData';

export default function AnalyticsScreen() {
  const [cycles, setCycles] = useState<PeriodCycle[]>(SUHANI_CYCLES);
  const [logs, setLogs] = useState<DailyLog[]>(SUHANI_LOGS);
  const [baseline, setBaseline] = useState<CycleBaseline>(SUHANI_BASELINE);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    let loadedCycles = await dbService.getCycles();
    if (loadedCycles.length === 0) {
      await dbService.seedSuhaniData();
      loadedCycles = await dbService.getCycles();
    }
    const loadedLogs = await dbService.getDailyLogs();
    const computedBaseline = MigrationService.calculateBaseline(loadedCycles);

    setCycles(loadedCycles);
    setLogs(loadedLogs);
    setBaseline(computedBaseline);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Cycle Analytics</Text>
          <Text style={styles.subtitle}>Health patterns and historical regularity</Text>
        </View>

        <CycleAnalytics baseline={baseline} cycles={cycles} logs={logs} />
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
