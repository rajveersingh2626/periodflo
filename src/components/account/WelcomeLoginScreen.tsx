import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { TactileButton } from '../ui/TactileButton';
import { dbService } from '../../services/storage/db';
import { UserProfile } from '../../services/storage/suhaniData';
import { ShieldCheck, Heart, UserPlus, ArrowRight } from 'lucide-react-native';

interface WelcomeLoginScreenProps {
  onLoginSuccess: () => void;
  onOpenCreate: () => void;
}

export const WelcomeLoginScreen: React.FC<WelcomeLoginScreenProps> = ({
  onLoginSuccess,
  onOpenCreate,
}) => {
  const [profiles] = useState<UserProfile[]>(() => dbService.getAllProfiles());

  const handleSelect = async (profileId: string) => {
    await dbService.login(profileId);
    onLoginSuccess();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Heart size={32} color={Colors.light.terracotta} />
          </View>
          <Text style={styles.brandTitle}>PeriodFLO</Text>
          <Text style={styles.brandSubtitle}>
            Privacy-first cycle tracking, predictive health analytics, and partner sync.
          </Text>
        </View>

        {/* Account Selector Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CHOOSE ACCOUNT</Text>
          <Text style={styles.cardDesc}>
            Select your profile to load your private end-to-end encrypted cycle data.
          </Text>

          {profiles.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.profileChoiceBtn}
              onPress={() => handleSelect(p.id)}
              activeOpacity={0.8}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {(p.name ? p.name.charAt(0) : 'U').toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.profileName}>{p.name}</Text>
                <Text style={styles.profileSubtitle}>
                  {p.id === 'suhani'
                    ? '47 cycles recorded • Day 18 Ovulatory'
                    : 'Personal Account • Fresh Start'}
                </Text>
              </View>
              <ArrowRight size={18} color={Colors.light.terracotta} />
            </TouchableOpacity>
          ))}

          <TactileButton
            title="Create New Profile"
            variant="outline"
            icon={<UserPlus size={16} color={Colors.light.terracotta} />}
            onPress={onOpenCreate}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Security Assurance */}
        <View style={styles.securityRow}>
          <ShieldCheck size={16} color={Colors.light.sage} />
          <Text style={styles.securityText}>
            Zero cloud trackers. Data is encrypted on your device with AES-256.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F8D7CC',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 280,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  profileChoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E8E4DE',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.terracotta,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  profileSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  securityText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginLeft: 8,
    textAlign: 'center',
  },
});
