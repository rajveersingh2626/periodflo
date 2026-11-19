import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Colors } from '../../theme/colors';
import { SpringConfigs } from '../../theme/springs';
import { AppLockService } from '../../services/security/appLock';
import { Lock, Delete } from 'lucide-react-native';

interface LockScreenProps {
  visible: boolean;
  onSuccess: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ visible, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);

    if (nextPin.length === 4) {
      setTimeout(() => {
        const isValid = AppLockService.verifyPin(nextPin);
        if (isValid) {
          setPin('');
          onSuccess();
        } else {
          setErrorShake(true);
          setTimeout(() => {
            setErrorShake(false);
            setPin('');
          }, 600);
        }
      }, 100);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.iconCircle}>
            <Lock size={24} color={Colors.light.terracotta} />
          </View>
          <Text style={styles.title}>PeriodFLO Locked</Text>
          <Text style={styles.subtitle}>Enter 4-digit PIN</Text>

          {/* 4-dot PIN indicator */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx < pin.length && styles.dotFilled,
                  errorShake && styles.dotError,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {digits.map((item, idx) => {
            if (item === '') {
              return <View key={idx} style={styles.emptyKey} />;
            }
            if (item === 'del') {
              return (
                <Pressable
                  key={idx}
                  onPress={handleDelete}
                  style={({ pressed }) => [
                    styles.key,
                    { transform: [{ scale: pressed ? SpringConfigs.tactileScale : 1 }] },
                  ]}
                >
                  <Delete size={22} color={Colors.light.textPrimary} />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={idx}
                onPress={() => handleDigitPress(item)}
                style={({ pressed }) => [
                  styles.key,
                  { transform: [{ scale: pressed ? SpringConfigs.tactileScale : 1 }] },
                ]}
              >
                <Text style={styles.keyText}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 28,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#C7C2BA',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.light.terracotta,
    borderColor: Colors.light.terracotta,
  },
  dotError: {
    backgroundColor: Colors.light.warning,
    borderColor: Colors.light.warning,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyKey: {
    width: 72,
    height: 72,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
});
