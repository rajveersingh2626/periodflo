import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { CycleBaseline, DailyLog, PeriodCycle } from '../../types/cycle';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react-native';

interface CycleAnalyticsProps {
  baseline: CycleBaseline;
  cycles: PeriodCycle[];
  logs: DailyLog[];
}

export const CycleAnalytics: React.FC<CycleAnalyticsProps> = ({ baseline, cycles, logs }) => {
  // Symptom frequency analysis
  const symptomCounts: Record<string, number> = {};
  for (const log of logs) {
    for (const sym of log.symptoms) {
      symptomCounts[sym] = (symptomCounts[sym] || 0) + 1;
    }
  }

  const sortedSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]);
  const maxSymptomCount = sortedSymptoms.length > 0 ? sortedSymptoms[0][1] : 1;

  const hasAnomaly = cycles.some(
    (c) =>
      c.cycleLengthDays &&
      (c.cycleLengthDays < 21 || c.cycleLengthDays > 38 || c.periodLengthDays > 8)
  );

  return (
    <View style={styles.container}>
      {/* Regularity & Baseline Hero */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>CYCLE REGULARITY</Text>
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{baseline.regularityScore}%</Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{baseline.averageCycleLengthDays}d</Text>
            <Text style={styles.statLabel}>Avg Cycle Length</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{baseline.averagePeriodLengthDays}d</Text>
            <Text style={styles.statLabel}>Avg Period Length</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{baseline.totalCyclesAnalyzed}</Text>
            <Text style={styles.statLabel}>Cycles Tracked</Text>
          </View>
        </View>
      </View>

      {/* Anomaly Alerts */}
      {hasAnomaly ? (
        <View style={[styles.alertCard, { backgroundColor: '#FDF2F0', borderColor: '#F5C6CB' }]}>
          <AlertCircle size={20} color={Colors.light.warning} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { color: Colors.light.warning }]}>
              Cycle Variation Detected
            </Text>
            <Text style={styles.alertBody}>
              One or more cycles were shorter than 21 days or longer than 38 days. Predictions have
              automatically adjusted.
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.alertCard, { backgroundColor: '#F0F8F5', borderColor: '#C3E6CB' }]}>
          <CheckCircle2 size={20} color={Colors.light.success} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { color: Colors.light.success }]}>
              Optimal Cycle Predictability
            </Text>
            <Text style={styles.alertBody}>
              Your cycle lengths are consistent. Forecast accuracy is high.
            </Text>
          </View>
        </View>
      )}

      {/* Symptom Frequency Distribution */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>TOP LOGGED SYMPTOMS</Text>
          <Activity size={16} color={Colors.light.textMuted} />
        </View>

        {sortedSymptoms.length === 0 ? (
          <Text style={styles.emptyText}>No symptoms logged yet. Check in daily to build trends!</Text>
        ) : (
          sortedSymptoms.slice(0, 5).map(([sym, count]) => {
            const barWidthPercent = Math.max(12, Math.round((count / maxSymptomCount) * 100));
            const formatName = sym.replace(/_/g, ' ');

            return (
              <View key={sym} style={styles.symptomRow}>
                <Text style={styles.symptomName}>{formatName}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${barWidthPercent}%`,
                        backgroundColor: Colors.light.terracotta,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.symptomCount}>{count}x</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  scorePill: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.terracotta,
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertBody: {
    fontSize: 12,
    color: Colors.light.textPrimary,
    lineHeight: 16,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  symptomName: {
    width: 100,
    fontSize: 13,
    color: Colors.light.textPrimary,
    textTransform: 'capitalize',
  },
  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#FAF8F5',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  symptomCount: {
    width: 30,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
