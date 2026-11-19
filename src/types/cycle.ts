export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export type PhysicalSymptom =
  | 'cramps'
  | 'fatigue'
  | 'headache'
  | 'bloating'
  | 'tender_breasts'
  | 'acne'
  | 'backache'
  | 'nausea'
  | 'cravings'
  | 'insomnia';

export type MoodType =
  | 'calm'
  | 'happy'
  | 'energetic'
  | 'sensitive'
  | 'irritable'
  | 'anxious'
  | 'low_energy';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface PeriodCycle {
  id: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
  cycleLengthDays?: number; // Days from this cycle's start to next cycle's start
  periodLengthDays: number; // Days of bleeding
  isOutlier?: boolean;
}

export interface DailyLog {
  id: string;
  date: string; // ISO YYYY-MM-DD
  flowIntensity?: FlowIntensity;
  symptoms: PhysicalSymptom[];
  moods: MoodType[];
  energyLevel?: number; // 1 to 5
  sleepQuality?: number; // 1 to 5
  bbtCelsius?: number; // Basal Body Temperature
  notes?: string;
  updatedAt?: string;
}

export interface CycleBaseline {
  averageCycleLengthDays: number;
  averagePeriodLengthDays: number;
  estimatedLutealPhaseDays: number;
  regularityScore: number; // 0 to 100
  totalCyclesAnalyzed: number;
}

export interface CyclePrediction {
  predictedPeriodStart: string; // YYYY-MM-DD
  predictedPeriodEnd: string; // YYYY-MM-DD
  predictedPeriodLengthDays: number;
  ovulationDate: string; // YYYY-MM-DD
  fertileWindowStart: string; // YYYY-MM-DD
  fertileWindowEnd: string; // YYYY-MM-DD
  currentCycleDay: number;
  currentPhase: CyclePhase;
  daysUntilNextPeriod: number;
  isOverdue?: boolean;
  daysLate?: number;
}
