import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { CyclePhase } from '../../types/cycle';
import { PhaseHelper } from '../../services/predictions/phases';

interface PhaseRingProps {
  cycleDay: number;
  phase: CyclePhase;
  daysUntilNextPeriod: number;
}

export const PhaseRing: React.FC<PhaseRingProps> = ({
  cycleDay,
  phase,
  daysUntilNextPeriod,
}) => {
  const metadata = PhaseHelper.getPhaseMetadata(phase);

  const getPhaseColor = () => {
    switch (phase) {
      case 'menstrual':
        return Colors.light.periodRed;
      case 'follicular':
        return Colors.light.sage;
      case 'ovulatory':
        return Colors.light.peach;
      case 'luteal':
        return Colors.light.mauve;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.outerRing, { borderColor: getPhaseColor() }]}>
        <View style={styles.innerContent}>
          <Text style={styles.dayLabel}>DAY</Text>
          <Text style={[styles.dayNumber, { color: getPhaseColor() }]}>{cycleDay}</Text>
          <Text style={styles.phaseBadge}>{metadata.title.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{metadata.subtitle}</Text>
      <View style={styles.countdownBadge}>
        <Text style={styles.countdownText}>
          {daysUntilNextPeriod === 0
            ? 'Period expected today'
            : `Next period in ~${daysUntilNextPeriod} days`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  innerContent: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: Colors.light.textMuted,
  },
  dayNumber: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
    letterSpacing: -1,
  },
  phaseBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 14,
    fontWeight: '400',
  },
  countdownBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  countdownText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textPrimary,
  },
});
