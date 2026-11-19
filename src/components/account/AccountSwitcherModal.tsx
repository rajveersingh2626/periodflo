import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { TactileButton } from '../ui/TactileButton';
import { dbService } from '../../services/storage/db';
import { UserProfile } from '../../services/storage/suhaniData';
import { X, Check, UserPlus, LogOut, Sparkles } from 'lucide-react-native';

interface AccountSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileChanged: () => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  visible,
  onClose,
  onProfileChanged,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => dbService.getAllProfiles());
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => dbService.getUserProfile());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('✨');
  const [cycleLength, setCycleLength] = useState('28');

  const avatarOptions = ['✨', '🌸', '🌿', '🌙', '💫', '🌻'];

  const refreshState = () => {
    setProfiles(dbService.getAllProfiles());
    setActiveProfile(dbService.getUserProfile());
  };

  const handleSelectProfile = async (id: string) => {
    await dbService.switchProfile(id);
    refreshState();
    onProfileChanged();
    onClose();
  };

  const handleCreateProfile = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      Alert.alert('Name Required', 'Please enter a name for the new profile.');
      return;
    }
    const cLen = parseInt(cycleLength, 10) || 28;
    await dbService.createProfile(trimmed, selectedAvatar, cLen, 5);
    refreshState();
    setIsCreating(false);
    setNewName('');
    onProfileChanged();
    onClose();
  };

  const handleLogout = async () => {
    await dbService.logout();
    refreshState();
    onProfileChanged();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Accounts & Profiles</Text>
              <Text style={styles.subtitle}>Switch profiles or create a fresh personal account</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Profiles List */}
            <Text style={styles.sectionLabel}>AVAILABLE ACCOUNTS</Text>
            {profiles.map((p) => {
              const isActive = p.id === activeProfile.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.profileCard, isActive && styles.profileCardActive]}
                  onPress={() => handleSelectProfile(p.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.profileAvatar}>
                    <Text style={{ fontSize: 24 }}>{p.avatar || '🌸'}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.profileName}>{p.name}</Text>
                      {isActive && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>ACTIVE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.profileMeta}>
                      {p.id === 'suhani'
                        ? '47 cycles recorded • 30-day baseline'
                        : `${p.averageCycleLengthDays}-day cycle • Sovereign Storage`}
                    </Text>
                  </View>
                  {isActive && (
                    <View style={styles.checkCircle}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Create New Account Section */}
            {!isCreating ? (
              <TactileButton
                title="Create New Profile"
                variant="outline"
                icon={<UserPlus size={16} color={Colors.light.terracotta} />}
                onPress={() => setIsCreating(true)}
                style={{ marginTop: 12 }}
              />
            ) : (
              <View style={styles.createBox}>
                <Text style={styles.createTitle}>New Profile</Text>

                <Text style={styles.inputLabel}>NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Maya"
                  placeholderTextColor={Colors.light.textMuted}
                  value={newName}
                  onChangeText={setNewName}
                />

                <Text style={styles.inputLabel}>CHOOSE AVATAR</Text>
                <View style={styles.avatarRow}>
                  {avatarOptions.map((av) => (
                    <TouchableOpacity
                      key={av}
                      style={[styles.avatarPick, selectedAvatar === av && styles.avatarPickSelected]}
                      onPress={() => setSelectedAvatar(av)}
                    >
                      <Text style={{ fontSize: 20 }}>{av}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>AVERAGE CYCLE LENGTH (DAYS)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="28"
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.light.textMuted}
                  value={cycleLength}
                  onChangeText={setCycleLength}
                />

                <View style={styles.createActionsRow}>
                  <TactileButton
                    title="Cancel"
                    variant="ghost"
                    onPress={() => setIsCreating(false)}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <TactileButton
                    title="Create & Switch"
                    variant="primary"
                    icon={<Sparkles size={16} color="#FFFFFF" />}
                    onPress={handleCreateProfile}
                    style={{ flex: 1.5 }}
                  />
                </View>
              </View>
            )}

            {/* Logout Option */}
            <TactileButton
              title="Log Out (Switch User Screen)"
              variant="ghost"
              icon={<LogOut size={16} color="#C94A29" />}
              onPress={handleLogout}
              style={styles.logoutBtn}
              textStyle={{ color: '#C94A29' }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 42, 38, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F5F2EB',
  },
  scrollArea: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E8E4DE',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  profileCardActive: {
    backgroundColor: '#FFF7F4',
    borderColor: Colors.light.terracotta,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  activeBadge: {
    backgroundColor: Colors.light.terracotta,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBox: {
    backgroundColor: '#FDFBF7',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.textPrimary,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
  avatarPick: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  avatarPickSelected: {
    borderColor: Colors.light.terracotta,
    backgroundColor: '#FFF7F4',
    borderWidth: 2,
  },
  createActionsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  logoutBtn: {
    marginTop: 16,
    marginBottom: 8,
  },
});
