import { PeriodCycle, DailyLog, FlowIntensity, PhysicalSymptom, MoodType } from '../../types/cycle';

export interface DeviceCycleItem {
  cycleStartDate: number | string;
  cycleEndDate?: number | string;
  isUserConfirmed?: boolean;
  predictedCycleStartDate?: number | string;
  predictedCycleEndDate?: number | string;
}

export interface DeviceDayEntryItem {
  entrydatekey: number | string;
  pStartedToday?: number;
  pEndedToday?: number;
  flow?: number;
  weight?: number;
  symptoms?: string;
  moods?: string;
}

export interface DeviceBackupJson {
  cycleList?: DeviceCycleItem[];
  entryList?: DeviceDayEntryItem[];
  settings?: Record<string, any>;
}

export class DeviceBackupParser {
  public static formatDateKey(key: number | string): string {
    const str = String(key).trim();
    if (str.includes('-')) {
      return str; // Already ISO YYYY-MM-DD
    }
    const num = parseInt(str, 10);
    if (isNaN(num) || str.length < 8) {
      return new Date().toISOString().split('T')[0];
    }
    const y = Math.floor(num / 10000);
    const m = String(Math.floor((num % 10000) / 100)).padStart(2, '0');
    const d = String(num % 100).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  public static parseCycles(cycleList: DeviceCycleItem[]): PeriodCycle[] {
    if (!cycleList || !Array.isArray(cycleList)) return [];

    // Copy and sort descending (newest first)
    const sorted = [...cycleList].sort((a, b) => {
      const aVal = typeof a.cycleStartDate === 'number' ? a.cycleStartDate : parseInt(String(a.cycleStartDate), 10);
      const bVal = typeof b.cycleStartDate === 'number' ? b.cycleStartDate : parseInt(String(b.cycleStartDate), 10);
      return bVal - aVal;
    });

    const parsed: PeriodCycle[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const startDate = this.formatDateKey(item.cycleStartDate);
      const endDate = item.cycleEndDate ? this.formatDateKey(item.cycleEndDate) : startDate;

      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      let periodLength = Math.max(1, Math.round((endMs - startMs) / 86400000) + 1);
      if (isNaN(periodLength) || periodLength <= 0 || periodLength > 15) {
        periodLength = 5;
      }

      parsed.push({
        id: `cycle-${startDate}`,
        startDate,
        endDate,
        periodLengthDays: periodLength,
      });
    }

    // Calculate cycle lengths between consecutive chronological cycles
    // In descending array: index i + 1 is older than index i
    for (let i = 0; i < parsed.length - 1; i++) {
      const newerMs = new Date(parsed[i].startDate).getTime();
      const olderMs = new Date(parsed[i + 1].startDate).getTime();
      const diffDays = Math.round((newerMs - olderMs) / 86400000);
      if (diffDays >= 15 && diffDays <= 65) {
        parsed[i + 1].cycleLengthDays = diffDays;
      }
    }

    return parsed;
  }

  private static readonly SYMPTOM_MAP: Record<string, PhysicalSymptom> = {
    acramps: 'cramps',
    cramps: 'cramps',
    backaches: 'backache',
    fatigue: 'fatigue',
    headaches: 'headache',
    migraines: 'headache',
    bloating: 'bloating',
    cravings: 'cravings',
    lappetite: 'nausea',
    nausea: 'nausea',
    clumsiness: 'fatigue',
    uconcentrate: 'fatigue',
    btenderness: 'tender_breasts',
    baches: 'tender_breasts',
    bsensitivity: 'tender_breasts',
    tbreast: 'tender_breasts',
    acne: 'acne',
    cskin: 'acne',
    insomnia: 'insomnia',
    sproblems: 'insomnia',
  };

  private static readonly MOOD_MAP: Record<string, MoodType> = {
    normal: 'calm',
    peaceful: 'calm',
    relaxed: 'calm',
    satisfied: 'calm',
    happy: 'happy',
    playful: 'happy',
    excited: 'happy',
    proud: 'happy',
    inlove: 'happy',
    sleepy: 'low_energy',
    exhausted: 'low_energy',
    stressed: 'anxious',
    anxious: 'anxious',
    panicky: 'anxious',
    worried: 'anxious',
    tense: 'anxious',
    emotional: 'sensitive',
    weird: 'sensitive',
    sad: 'sensitive',
    moodiness: 'sensitive',
    depressed: 'sensitive',
    impatient: 'irritable',
    frustrated: 'irritable',
    grumpy: 'irritable',
    cranky: 'irritable',
    irritability: 'irritable',
    angry: 'irritable',
    hyped: 'energetic',
    focused: 'calm',
  };

  public static parseDayEntries(entryList: DeviceDayEntryItem[]): DailyLog[] {
    if (!entryList || !Array.isArray(entryList)) return [];

    const logs: DailyLog[] = [];

    for (const entry of entryList) {
      const date = this.formatDateKey(entry.entrydatekey);
      const symptoms: PhysicalSymptom[] = [];
      const moods: MoodType[] = [];
      let flowIntensity: FlowIntensity | undefined = undefined;

      if (entry.flow === 1) flowIntensity = 'light';
      else if (entry.flow === 2) flowIntensity = 'medium';
      else if (entry.flow === 3) flowIntensity = 'heavy';
      else if (entry.pStartedToday === 1) flowIntensity = 'medium';

      if (entry.symptoms) {
        const rawList = entry.symptoms.split(',').map((s) => s.trim().toLowerCase());
        for (const raw of rawList) {
          if (raw === 'spotting' || raw === 'obleeding') {
            if (!flowIntensity) {
              flowIntensity = 'spotting';
            }
          }
          const mappedSymptom = this.SYMPTOM_MAP[raw];
          if (mappedSymptom && !symptoms.includes(mappedSymptom)) {
            symptoms.push(mappedSymptom);
          }
          const mappedMood = this.MOOD_MAP[raw];
          if (mappedMood && !moods.includes(mappedMood)) {
            moods.push(mappedMood);
          }
        }
      }

      if (entry.moods) {
        const rawList = entry.moods.split(',').map((m) => m.trim().toLowerCase());
        for (const raw of rawList) {
          const mapped = this.MOOD_MAP[raw];
          if (mapped && !moods.includes(mapped)) {
            moods.push(mapped);
          }
        }
      }

      let energyLevel: number | undefined = undefined;
      if (moods.includes('low_energy') || symptoms.includes('fatigue')) {
        energyLevel = 2;
      } else if (moods.includes('happy') || moods.includes('energetic')) {
        energyLevel = 4;
      }

      let notes: string | undefined = undefined;
      if (entry.weight) {
        notes = `Weight: ${entry.weight} kg`;
      }

      logs.push({
        id: `log-${date}`,
        date,
        flowIntensity,
        symptoms,
        moods,
        energyLevel,
        notes,
      });
    }

    return logs.sort((a, b) => b.date.localeCompare(a.date));
  }

  public static parseJson(jsonString: string): { cycles: PeriodCycle[]; logs: DailyLog[] } {
    try {
      const data = JSON.parse(jsonString);
      let cycles: PeriodCycle[] = [];
      let logs: DailyLog[] = [];

      if (data.cycleList) {
        cycles = this.parseCycles(data.cycleList);
      } else if (Array.isArray(data) && data[0]?.cycleStartDate) {
        cycles = this.parseCycles(data);
      }

      if (data.entryList) {
        logs = this.parseDayEntries(data.entryList);
      } else if (Array.isArray(data) && data[0]?.entrydatekey) {
        logs = this.parseDayEntries(data);
      }

      return { cycles, logs };
    } catch {
      return { cycles: [], logs: [] };
    }
  }
}
