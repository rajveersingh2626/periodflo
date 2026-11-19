import { describe, it, expect } from 'vitest';
import { DailyLog, FlowIntensity, PhysicalSymptom, MoodType } from '../../src/types/cycle';

describe('Daily Check-in & Logging Data Structures', () => {
  it('should construct a structured daily check-in with all flow, symptoms, and biometrics', () => {
    const date = '2026-10-14';
    const flow: FlowIntensity = 'heavy';
    const symptoms: PhysicalSymptom[] = ['cramps', 'fatigue', 'headache'];
    const moods: MoodType[] = ['sensitive', 'low_energy'];
    const energyLevel = 2;
    const sleepQuality = 3;
    const bbtCelsius = 36.5;
    const notes = 'Cramps started early morning, applied heat pad.';

    const logEntry: DailyLog = {
      id: `log-${date}`,
      date,
      flowIntensity: flow,
      symptoms,
      moods,
      energyLevel,
      sleepQuality,
      bbtCelsius,
      notes,
      updatedAt: new Date().toISOString(),
    };

    expect(logEntry.id).toBe('log-2026-10-14');
    expect(logEntry.symptoms).toHaveLength(3);
    expect(logEntry.moods).toContain('sensitive');
    expect(logEntry.bbtCelsius).toBe(36.5);
  });

  it('should correctly format month calendar date cells with status classifications', () => {
    const days = [
      { date: '2026-10-01', isPeriod: true, isPredicted: false, isFertile: false, isOvulation: false },
      { date: '2026-10-12', isPeriod: false, isPredicted: false, isFertile: true, isOvulation: false },
      { date: '2026-10-14', isPeriod: false, isPredicted: false, isFertile: true, isOvulation: true },
      { date: '2026-10-27', isPeriod: false, isPredicted: true, isFertile: false, isOvulation: false },
    ];

    expect(days[0].isPeriod).toBe(true);
    expect(days[2].isOvulation).toBe(true);
    expect(days[3].isPredicted).toBe(true);
  });
});
