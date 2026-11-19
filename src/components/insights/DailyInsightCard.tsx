import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { DailyInsightResult } from '../../services/insights/nlgEngine';
import { Sparkles, Activity } from 'lucide-react-native';

interface DailyInsightCardProps {
  insight: DailyInsightResult;
}

export const DailyInsightCard: React.FC<DailyInsightCardProps> = ({ insight }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Sparkles size={18} color={Colors.light.terracotta} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.eyebrow}>PHYSIOLOGICAL INSIGHT</Text>
          <Text style={styles.phaseTitle}>
            Day {insight.cycleDay} • {insight.phase.toUpperCase()} PHASE
          </Text>
        </View>
      </View>

      <Text style={styles.narrative}>{insight.primaryNarrative}</Text>

      {/* Hormonal Activity Strip */}
      <View style={styles.hormoneStrip}>
        <View style={styles.hormoneHeader}>
          <Activity size={14} color={Colors.light.textMuted} />
          <Text style={styles.hormoneLabel}>HORMONAL TRAJECTORY</Text>
        </View>
        <View style={styles.hormoneGrid}>
          <View style={styles.hormoneItem}>
            <Text style={styles.hormoneName}>Estrogen</Text>
            <Text style={styles.hormoneValue}>{insight.hormoneStatus.estrogen.toUpperCase()}</Text>
          </View>
          <View style={styles.hormoneItem}>
            <Text style={styles.hormoneName}>Progesterone</Text>
            <Text style={styles.hormoneValue}>
              {insight.hormoneStatus.progesterone.toUpperCase()}
            </Text>
          </View>
          <View style={styles.hormoneItem}>
            <Text style={styles.hormoneName}>LH Level</Text>
            <Text style={styles.hormoneValue}>{insight.hormoneStatus.lh.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 12,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.terracotta,
    letterSpacing: 1.1,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  narrative: {
    fontSize: 15,
    lineHeight: 23,
    color: Colors.light.textPrimary,
    fontWeight: '400',
  },
  hormoneStrip: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  hormoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  hormoneLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  hormoneGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    padding: 12,
  },
  hormoneItem: {
    alignItems: 'center',
  },
  hormoneName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  hormoneValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.terracotta,
    marginTop: 3,
  },
});
