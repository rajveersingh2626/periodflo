import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { CyclePhase } from '../../types/cycle';
import { PhaseHelper } from '../../services/predictions/phases';
import { Sparkles } from 'lucide-react-native';

interface PhaseRingProps {
  cycleDay: number;
  phase: CyclePhase;
  daysUntilNextPeriod: number;
  isOverdue?: boolean;
  daysLate?: number;
  isOverridden?: boolean;
  onPressCalibrate?: () => void;
}

export const PhaseRing: React.FC<PhaseRingProps> = ({
  cycleDay,
  phase,
  daysUntilNextPeriod,
  isOverdue = false,
  daysLate = 0,
  isOverridden = false,
  onPressCalibrate,
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

  const getCountdownLabel = () => {
    if (isOverdue && daysLate > 0) {
      return `Period is ~${daysLate} ${daysLate === 1 ? 'day' : 'days'} late`;
    }
    if (daysUntilNextPeriod === 0) {
      return 'Period expected today';
    }
    return `Next period in ~${daysUntilNextPeriod} days`;
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
      
      <View style={[styles.countdownBadge, isOverdue && { borderColor: Colors.light.warning, backgroundColor: '#FDF2F0' }]}>
        <Text style={[styles.countdownText, isOverdue && { color: Colors.light.warning }]}>
          {getCountdownLabel()}
        </Text>
      </View>

      {onPressCalibrate && (
        <TouchableOpacity
          style={[styles.calibratePill, isOverridden && styles.calibratePillActive]}
          onPress={onPressCalibrate}
          activeOpacity={0.7}
        >
          <Sparkles size={12} color={isOverridden ? Colors.light.terracotta : Colors.light.textSecondary} />
          <Text style={[styles.calibrateText, isOverridden && styles.calibrateTextActive]}>
            {isOverridden ? `Calibrated: ${metadata.title}` : "Feels like a different phase? Adjust"}
          </Text>
        </TouchableOpacity>
      )}
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
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.light.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  countdownBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  calibratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F7F5F2',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  calibratePillActive: {
    backgroundColor: '#FBF0EC',
    borderColor: '#F5D0C5',
  },
  calibrateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  calibrateTextActive: {
    color: Colors.light.terracotta,
  },
});
