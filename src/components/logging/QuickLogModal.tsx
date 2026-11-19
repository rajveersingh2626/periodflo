import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { FlowIntensity, PhysicalSymptom, MoodType, DailyLog } from '../../types/cycle';
import { Chip } from '../ui/Chip';
import { TactileButton } from '../ui/TactileButton';

interface QuickLogModalProps {
  visible: boolean;
  date: string; // YYYY-MM-DD
  existingLog?: DailyLog | null;
  onClose: () => void;
  onSave: (log: DailyLog) => void;
}

const FLOW_OPTIONS: { label: string; value: FlowIntensity }[] = [
  { label: 'None', value: 'none' },
  { label: 'Spotting', value: 'spotting' },
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Heavy', value: 'heavy' },
];

const SYMPTOM_OPTIONS: { label: string; value: PhysicalSymptom }[] = [
  { label: 'Cramps', value: 'cramps' },
  { label: 'Fatigue', value: 'fatigue' },
  { label: 'Headache', value: 'headache' },
  { label: 'Bloating', value: 'bloating' },
  { label: 'Tender Breasts', value: 'tender_breasts' },
  { label: 'Acne', value: 'acne' },
  { label: 'Backache', value: 'backache' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'Cravings', value: 'cravings' },
  { label: 'Insomnia', value: 'insomnia' },
];

const MOOD_OPTIONS: { label: string; value: MoodType }[] = [
  { label: 'Calm', value: 'calm' },
  { label: 'Happy', value: 'happy' },
  { label: 'Energetic', value: 'energetic' },
  { label: 'Sensitive', value: 'sensitive' },
  { label: 'Irritable', value: 'irritable' },
  { label: 'Anxious', value: 'anxious' },
  { label: 'Low Energy', value: 'low_energy' },
];

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  visible,
  date,
  existingLog,
  onClose,
  onSave,
}) => {
  const [flow, setFlow] = useState<FlowIntensity>('none');
  const [symptoms, setSymptoms] = useState<PhysicalSymptom[]>([]);
  const [moods, setMoods] = useState<MoodType[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [bbt, setBbt] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (existingLog) {
      setFlow(existingLog.flowIntensity || 'none');
      setSymptoms(existingLog.symptoms || []);
      setMoods(existingLog.moods || []);
      setEnergyLevel(existingLog.energyLevel || 3);
      setSleepQuality(existingLog.sleepQuality || 4);
      setBbt(existingLog.bbtCelsius ? String(existingLog.bbtCelsius) : '');
      setNotes(existingLog.notes || '');
    } else {
      setFlow('none');
      setSymptoms([]);
      setMoods([]);
      setEnergyLevel(3);
      setSleepQuality(4);
      setBbt('');
      setNotes('');
    }
  }, [existingLog, visible]);

  const toggleSymptom = (sym: PhysicalSymptom) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const toggleMood = (m: MoodType) => {
    setMoods((prev) => (prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]));
  };

  const handleSave = () => {
    const log: DailyLog = {
      id: `log-${date}`,
      date,
      flowIntensity: flow,
      symptoms,
      moods,
      energyLevel,
      sleepQuality,
      bbtCelsius: bbt ? parseFloat(bbt) : undefined,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    onSave(log);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />
          <View style={styles.header}>
            <Text style={styles.title}>Daily Log</Text>
            <Text style={styles.dateSubtitle}>{date}</Text>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Flow Intensity */}
            <Text style={styles.sectionHeader}>FLOW INTENSITY</Text>
            <View style={styles.chipRow}>
              {FLOW_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={flow === opt.value}
                  onPress={() => setFlow(opt.value)}
                />
              ))}
            </View>

            {/* Physical Symptoms */}
            <Text style={styles.sectionHeader}>PHYSICAL SYMPTOMS</Text>
            <View style={styles.chipRow}>
              {SYMPTOM_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={symptoms.includes(opt.value)}
                  onPress={() => toggleSymptom(opt.value)}
                />
              ))}
            </View>

            {/* Moods */}
            <Text style={styles.sectionHeader}>MOOD & VIBE</Text>
            <View style={styles.chipRow}>
              {MOOD_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={moods.includes(opt.value)}
                  onPress={() => toggleMood(opt.value)}
                />
              ))}
            </View>

            {/* Energy Level Slider/Chips */}
            <Text style={styles.sectionHeader}>ENERGY LEVEL (1 = LOW, 5 = VIBRANT)</Text>
            <View style={styles.chipRow}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <Chip
                  key={lvl}
                  label={lvl === 1 ? '1 • Low' : lvl === 5 ? '5 • Peak' : String(lvl)}
                  selected={energyLevel === lvl}
                  onPress={() => setEnergyLevel(lvl)}
                />
              ))}
            </View>

            {/* Basal Body Temperature */}
            <Text style={styles.sectionHeader}>BASAL BODY TEMP (°C)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 36.5"
              placeholderTextColor={Colors.light.textMuted}
              keyboardType="decimal-pad"
              value={bbt}
              onChangeText={setBbt}
            />

            {/* Notes */}
            <Text style={styles.sectionHeader}>PERSONAL NOTES (ENCRYPTED ON-DEVICE)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="How are you feeling today?"
              placeholderTextColor={Colors.light.textMuted}
              multiline={true}
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.buttonRow}>
              <TactileButton title="Cancel" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
              <TactileButton
                title="Save Check-in"
                variant="primary"
                onPress={handleSave}
                style={{ flex: 2 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  handleBar: {
    width: 44,
    height: 5,
    backgroundColor: '#E0DDD7',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.4,
  },
  dateSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  scrollArea: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
});
