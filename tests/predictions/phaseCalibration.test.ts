import { describe, it, expect, beforeEach } from 'vitest';
import { dbService } from '../../src/services/storage/db';
import { PredictiveEngine } from '../../src/services/predictions/engine';
import { InsightEngine } from '../../src/services/insights/nlgEngine';
import { DailyLog, PeriodCycle, CyclePhase } from '../../src/types/cycle';

describe('Phase Override & Body Autonomy Calibration', () => {
  beforeEach(async () => {
    await dbService.wipeDatabase();
  });

  it('allows calibrating to a different phase when body feels different from algorithm', async () => {
    // Standard 28-day cycle starting on 2026-11-01
    const testCycle: PeriodCycle = {
      id: 'cycle-1',
      startDate: '2026-11-01',
      endDate: '2026-11-01',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    };
    await dbService.saveCycle(testCycle);

    // On Day 18 (2026-11-18), algorithmic prediction is Luteal
    const asOfDate = '2026-11-18';
    const cycles = await dbService.getCycles();
    const prediction = PredictiveEngine.calculatePredictions(cycles, asOfDate);
    expect(prediction.currentPhase).toBe('luteal');

    // User feels ovulatory today (e.g. noticed peak cervical mucus or late ovulation)
    const log: DailyLog = {
      id: `log-${asOfDate}`,
      date: asOfDate,
      symptoms: ['bloating'],
      moods: ['energetic'],
      overridePhase: 'ovulatory' as CyclePhase,
      phaseOverrideReason: 'Noticed peak stretchy cervical mucus',
    };
    await dbService.saveDailyLog(log);

    // Retrieve saved log
    const savedLog = await dbService.getDailyLog(asOfDate);
    expect(savedLog).not.toBeNull();
    expect(savedLog?.overridePhase).toBe('ovulatory');
    expect(savedLog?.phaseOverrideReason).toContain('stretchy');

    // Effective phase should now be ovulatory
    const effectivePhase = savedLog?.overridePhase || prediction.currentPhase;
    expect(effectivePhase).toBe('ovulatory');

    // Insights generated with effective phase should reflect ovulatory hormones & evidence
    const insight = InsightEngine.generateDailyInsight({
      cycleDay: prediction.currentCycleDay,
      phase: effectivePhase,
      symptoms: savedLog?.symptoms || [],
    });

    expect(insight.phase).toBe('ovulatory');
    expect(insight.hormoneStatus.estrogen).toBe('peak');
    expect(insight.hormoneStatus.lh).toBe('surge');
    expect(insight.primaryNarrative.toLowerCase()).toMatch(/ovulat|luteinizing|estradiol/);
  });

  it('allows resetting calibration back to pure algorithmic calculation', async () => {
    const asOfDate = '2026-11-18';
    const log: DailyLog = {
      id: `log-${asOfDate}`,
      date: asOfDate,
      symptoms: [],
      moods: [],
      overridePhase: 'follicular',
      phaseOverrideReason: 'High stamina and focus',
    };
    await dbService.saveDailyLog(log);

    // Now reset it
    const existing = await dbService.getDailyLog(asOfDate);
    if (existing) {
      delete existing.overridePhase;
      delete existing.phaseOverrideReason;
      await dbService.saveDailyLog(existing);
    }

    const updated = await dbService.getDailyLog(asOfDate);
    expect(updated?.overridePhase).toBeUndefined();
    expect(updated?.phaseOverrideReason).toBeUndefined();
  });
});
