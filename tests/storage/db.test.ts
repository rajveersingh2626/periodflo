import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseService } from '../../src/services/storage/db';
import { PeriodCycle, DailyLog } from '../../src/types/cycle';

describe('DatabaseService (Encrypted Local Storage)', () => {
  let db: DatabaseService;

  beforeEach(async () => {
    db = new DatabaseService();
    await db.wipeDatabase();
  });

  it('should save and retrieve period cycles ordered by startDate descending', async () => {
    const cycle1: PeriodCycle = {
      id: 'c1',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    };
    const cycle2: PeriodCycle = {
      id: 'c2',
      startDate: '2026-09-29',
      endDate: '2026-10-04',
      cycleLengthDays: 29,
      periodLengthDays: 6,
    };

    await db.saveCycle(cycle1);
    await db.saveCycle(cycle2);

    const cycles = await db.getCycles();
    expect(cycles.length).toBe(2);
    expect(cycles[0].id).toBe('c2'); // Most recent first
    expect(cycles[1].id).toBe('c1');
  });

  it('should save and retrieve daily symptom and flow logs', async () => {
    const log: DailyLog = {
      id: 'log-2026-10-01',
      date: '2026-10-01',
      flowIntensity: 'medium',
      symptoms: ['cramps', 'fatigue'],
      moods: ['calm'],
      energyLevel: 3,
      sleepQuality: 4,
      bbtCelsius: 36.4,
      notes: 'Feeling restful',
    };

    await db.saveDailyLog(log);
    const retrieved = await db.getDailyLog('2026-10-01');
    expect(retrieved).toBeDefined();
    expect(retrieved?.flowIntensity).toBe('medium');
    expect(retrieved?.symptoms).toContain('cramps');
    expect(retrieved?.bbtCelsius).toBe(36.4);
  });

  it('should securely wipe all data on request', async () => {
    await db.saveCycle({
      id: 'c-wipe',
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    });

    expect((await db.getCycles()).length).toBe(1);

    await db.wipeDatabase();
    expect((await db.getCycles()).length).toBe(0);
    expect(await db.getDailyLog('2026-10-01')).toBeNull();
  });
});
