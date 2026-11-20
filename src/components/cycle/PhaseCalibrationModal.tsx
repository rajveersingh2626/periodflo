import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { CyclePhase } from '../../types/cycle';
import { TactileButton } from '../ui/TactileButton';
import { Sparkles, Check, RotateCcw, X, Info, Flame, Droplet, Sun, Moon } from 'lucide-react-native';

interface PhaseCalibrationModalProps {
  visible: boolean;
  currentPhase: CyclePhase;
  currentCycleDay: number;
  initialOverriddenPhase?: CyclePhase;
  initialReason?: string;
  onClose: () => void;
  onSaveCalibration: (phase: CyclePhase | null, reason?: string) => Promise<void>;
}

interface PhaseOption {
  phase: CyclePhase;
  label: string;
  badge: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  summary: string;
}

const PHASE_OPTIONS: PhaseOption[] = [
  {
    phase: 'menstrual',
    label: 'Menstrual Phase',
    badge: 'DAYS ~1–5',
    color: Colors.light.periodRed,
    bgColor: '#FDF2F0',
    icon: <Droplet size={18} color={Colors.light.periodRed} />,
    summary: 'Active menses, internal reset, parasympathetic conservation, and cellular repair.',
  },
  {
    phase: 'follicular',
    label: 'Follicular Phase',
    badge: 'DAYS ~6–13',
    color: Colors.light.sage,
    bgColor: '#F1F7F4',
    icon: <Sun size={18} color={Colors.light.sage} />,
    summary: 'Estradiol rising, high insulin sensitivity, mental sharpness, and physical stamina.',
  },
  {
    phase: 'ovulatory',
    label: 'Ovulatory Phase',
    badge: 'DAYS ~14–16',
    color: Colors.light.terracotta,
    bgColor: '#FBF0EC',
    icon: <Flame size={18} color={Colors.light.terracotta} />,
    summary: 'LH surge, peak estrogen, clear stretchy cervical mucus, and peak social confidence.',
  },
  {
    phase: 'luteal',
    label: 'Luteal Phase',
    badge: 'DAYS ~17–28',
    color: Colors.light.mauve,
    bgColor: '#F6F3F8',
    icon: <Moon size={18} color={Colors.light.mauve} />,
    summary: 'Progesterone dominance, ~0.4°C higher core temp, metabolic elevation, and nesting.',
  },
];

const COMMON_REASONS = [
  '🧪 Positive LH ovulation test strip today',
  '💧 Noticed peak stretchy (egg-white) cervical mucus',
  '⚡ High physical stamina & upbeat mood (feels follicular)',
  '🌙 Experiencing PMS cues, bloating, or breast tenderness',
  '🩸 Started early spotting or light flow',
  '✈️ Recent travel, illness, or stress delayed my cycle',
];

export const PhaseCalibrationModal: React.FC<PhaseCalibrationModalProps> = ({
  visible,
  currentPhase,
  currentCycleDay,
  initialOverriddenPhase,
  initialReason,
  onClose,
  onSaveCalibration,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(
    initialOverriddenPhase || currentPhase
  );
  const [selectedReason, setSelectedReason] = useState<string>(initialReason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOverridden = !!initialOverriddenPhase;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSaveCalibration(selectedPhase, selectedReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetToAlgorithm = async () => {
    setIsSubmitting(true);
    try {
      await onSaveCalibration(null);
      setSelectedPhase(currentPhase);
      setSelectedReason('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Sparkles size={14} color={Colors.light.terracotta} />
                <Text style={styles.headerEyebrow}>BODY AUTONOMY & CALIBRATION</Text>
              </View>
              <Text style={styles.title}>Calibrate Your Phase</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Context Note */}
            <View style={styles.infoBox}>
              <Info size={16} color="#0284C7" style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={styles.infoText}>
                Algorithms estimate your phase based on statistical averages. But real bodies
                respond dynamically to stress, travel, sleep, and lifestyle. If you feel like
                you&apos;re in a different phase, your body knows best.
              </Text>
            </View>

            {/* Current Algorithmic Baseline */}
            <View style={styles.currentEstimateRow}>
              <Text style={styles.estimateLabel}>Algorithm estimate for Day {currentCycleDay}:</Text>
              <View style={styles.estimatePill}>
                <Text style={styles.estimatePillText}>{currentPhase.toUpperCase()}</Text>
              </View>
            </View>

            {/* Select Which Phase You Feel */}
            <Text style={styles.sectionHeader}>What phase does your body feel like?</Text>

            <View style={styles.phasesList}>
              {PHASE_OPTIONS.map((item) => {
                const isSelected = selectedPhase === item.phase;
                return (
                  <TouchableOpacity
                    key={item.phase}
                    style={[
                      styles.phaseCard,
                      isSelected && {
                        borderColor: item.color,
                        backgroundColor: item.bgColor,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedPhase(item.phase)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.phaseCardHeader}>
                      <View style={[styles.phaseIconCircle, { backgroundColor: '#FFFFFF' }]}>
                        {item.icon}
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.phaseLabel, isSelected && { color: item.color }]}>
                          {item.label}
                        </Text>
                        <Text style={styles.phaseBadgeText}>{item.badge}</Text>
                      </View>
                      {isSelected && (
                        <View style={[styles.checkCircle, { backgroundColor: item.color }]}>
                          <Check size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.phaseSummary}>{item.summary}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Biological Cues & Reasons */}
            <Text style={styles.sectionHeader}>What prompted this adjustment? (Optional)</Text>
            <View style={styles.reasonsList}>
              {COMMON_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonChip,
                      isSelected && styles.reasonChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedReason(isSelected ? '' : reason)
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.reasonChipText,
                        isSelected && styles.reasonChipTextSelected,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TactileButton
              title={isSubmitting ? 'Calibrating...' : 'Apply Phase Calibration'}
              variant="primary"
              onPress={handleSave}
              style={styles.saveBtn}
            />

            {isOverridden && (
              <TouchableOpacity
                onPress={handleResetToAlgorithm}
                style={styles.resetBtn}
                activeOpacity={0.7}
              >
                <RotateCcw size={14} color={Colors.light.textMuted} style={{ marginRight: 6 }} />
                <Text style={styles.resetBtnText}>Reset to Algorithmic Estimate</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE6',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.terracotta,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    paddingHorizontal: 22,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#0369A1',
    fontWeight: '500',
  },
  currentEstimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  estimateLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  estimatePill: {
    backgroundColor: '#E8E4DE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estimatePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  phasesList: {
    gap: 10,
    marginBottom: 16,
  },
  phaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DE',
  },
  phaseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  phaseIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0ECE6',
  },
  phaseLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.textMuted,
    letterSpacing: 0.6,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseSummary: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  reasonsList: {
    gap: 8,
    marginBottom: 20,
  },
  reasonChip: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },
  reasonChipSelected: {
    backgroundColor: '#FDF1E8',
    borderColor: Colors.light.terracotta,
  },
  reasonChipText: {
    fontSize: 12,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  reasonChipTextSelected: {
    color: Colors.light.terracotta,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  saveBtn: {
    width: '100%',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 6,
  },
  resetBtnText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    fontWeight: '600',
  },
});
