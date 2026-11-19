import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { WellnessTips } from '../../services/insights/wellnessAdvice';
import { Apple, Droplets, Dumbbell, HeartHandshake } from 'lucide-react-native';

interface WellnessCardsProps {
  tips: WellnessTips;
}

export const WellnessCards: React.FC<WellnessCardsProps> = ({ tips }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Phase-Based Wellness</Text>

      {/* Nutrition Card */}
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: '#FDF1E8' }]}>
          <Apple size={18} color="#D97706" />
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>NUTRITION FOCUS</Text>
          <Text style={styles.cardBody}>{tips.nutrition}</Text>
        </View>
      </View>

      {/* Hydration Card */}
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: '#E8F4F8' }]}>
          <Droplets size={18} color="#0284C7" />
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>HYDRATION & INFUSIONS</Text>
          <Text style={styles.cardBody}>{tips.hydration}</Text>
        </View>
      </View>

      {/* Workout Card */}
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: '#EEF7F2' }]}>
          <Dumbbell size={18} color={Colors.light.sage} />
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>EXERCISE INTENSITY</Text>
          <Text style={styles.cardBody}>{tips.workout}</Text>
        </View>
      </View>

      {/* Self-Care Card */}
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: '#F4F1F8' }]}>
          <HeartHandshake size={18} color={Colors.light.mauve} />
        </View>
        <View style={styles.content}>
          <Text style={styles.cardTitle}>SELF-CARE & RECOVERY</Text>
          <Text style={styles.cardBody}>{tips.selfCare}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.textPrimary,
  },
});
