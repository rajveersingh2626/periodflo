import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { PartnerPayload } from '../../services/sync/e2ee';
import { Lock, Heart } from 'lucide-react-native';

interface PartnerHeroProps {
  payload: PartnerPayload;
}

export const PartnerHero: React.FC<PartnerHeroProps> = ({ payload }) => {
  return (
    <View style={styles.heroCard}>
      <View style={styles.topBadgeRow}>
        <View style={styles.securityBadge}>
          <Lock size={12} color={Colors.light.success} />
          <Text style={styles.securityText}>END-TO-END ENCRYPTED</Text>
        </View>
        <Heart size={16} color={Colors.light.terracotta} />
      </View>

      <Text style={styles.cycleDayTitle}>
        {payload.cycleDay ? `Cycle Day ${payload.cycleDay}` : 'Partner Connected'}
      </Text>

      {payload.phase && (
        <View style={styles.phasePill}>
          <Text style={styles.phasePillText}>{payload.phase.toUpperCase()} PHASE</Text>
        </View>
      )}

      {typeof payload.countdownDays === 'number' && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownNumber}>{payload.countdownDays}</Text>
          <Text style={styles.countdownLabel}>DAYS UNTIL NEXT PERIOD</Text>
        </View>
      )}

      {payload.energyForecast && (
        <View style={styles.energyBox}>
          <Text style={styles.energyLabel}>EXPECTED DAILY ENERGY</Text>
          <Text style={styles.energyValue}>{payload.energyForecast}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  securityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.success,
    letterSpacing: 0.5,
  },
  cycleDayTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: -0.6,
  },
  phasePill: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  phasePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.terracotta,
    letterSpacing: 0.8,
  },
  countdownContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  countdownNumber: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.light.terracotta,
    lineHeight: 56,
  },
  countdownLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 1,
    marginTop: 4,
  },
  energyBox: {
    width: '100%',
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  energyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  energyValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginTop: 3,
  },
});
