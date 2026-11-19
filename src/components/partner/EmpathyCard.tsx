import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Lightbulb } from 'lucide-react-native';

interface EmpathyCardProps {
  tip?: string;
  symptoms?: string[];
}

export const EmpathyCard: React.FC<EmpathyCardProps> = ({ tip, symptoms = [] }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Lightbulb size={18} color="#D97706" />
        </View>
        <Text style={styles.headerTitle}>HOW TO BEST SUPPORT HER TODAY</Text>
      </View>

      <Text style={styles.tipBody}>
        {tip ||
          'Check in gently, listen attentively without trying to fix, and offer an easy evening together.'}
      </Text>

      {symptoms.length > 0 && (
        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsHeader}>SHARED SYMPTOMS</Text>
          <View style={styles.symptomPillsRow}>
            {symptoms.map((s) => (
              <View key={s} style={styles.symptomPill}>
                <Text style={styles.symptomPillText}>{s.replace(/_/g, ' ')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    marginVertical: 10,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
  },
  tipBody: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  symptomsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  symptomsHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  symptomPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomPill: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  symptomPillText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
