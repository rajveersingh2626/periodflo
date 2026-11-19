import { describe, it, expect } from 'vitest';
import { DailyLog } from '../../src/types/cycle';

describe('Analytics & Wellness Aggregations', () => {
  it('should compute symptom frequencies from logs', () => {
    const logs: DailyLog[] = [
      {
        id: '1',
        date: '2026-10-01',
        symptoms: ['cramps', 'fatigue'],
        moods: ['low_energy'],
      },
      {
        id: '2',
        date: '2026-10-02',
        symptoms: ['cramps', 'bloating'],
        moods: ['calm'],
      },
      {
        id: '3',
        date: '2026-10-03',
        symptoms: ['cramps'],
        moods: ['calm'],
      },
    ];

    const freqMap: Record<string, number> = {};
    for (const log of logs) {
      for (const s of log.symptoms) {
        freqMap[s] = (freqMap[s] || 0) + 1;
      }
    }

    expect(freqMap['cramps']).toBe(3);
    expect(freqMap['fatigue']).toBe(1);
    expect(freqMap['bloating']).toBe(1);
  });
});
