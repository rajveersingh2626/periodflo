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

  it('automatically updates cycle dates, period countdown, and ovulation when calibrated', async () => {
    // 30-day baseline cycle starting on 2026-11-02
    const testCycle: PeriodCycle = {
      id: 'cycle-1',
      startDate: '2026-11-02',
      endDate: '2026-11-05',
      cycleLengthDays: 30,
      periodLengthDays: 4,
    };
    const cycles = [testCycle];
    const today = '2026-11-20'; // Day 19

    // Without calibration, standard prediction calculates period at Day 30 (2026-12-02)
    const standardPred = PredictiveEngine.calculatePredictions(cycles, today);
    expect(standardPred.predictedPeriodStart).toBe('2026-12-02');
    expect(standardPred.daysUntilNextPeriod).toBe(12);

    // User calibrates to Ovulatory on 2026-11-20 (ovulation confirmed today)
    const ovulatoryPred = PredictiveEngine.calculatePredictions(
      cycles,
      today,
      'ovulatory',
      'Positive LH test'
    );

    // Post-ovulatory luteal phase is constant 14 days, so period shifts to today + 14 = 2026-12-04
    expect(ovulatoryPred.currentPhase).toBe('ovulatory');
    expect(ovulatoryPred.ovulationDate).toBe('2026-11-20');
    expect(ovulatoryPred.predictedPeriodStart).toBe('2026-12-04');
    expect(ovulatoryPred.daysUntilNextPeriod).toBe(14);
    expect(ovulatoryPred.isPhaseOverridden).toBe(true);

    // If user calibrates to Menstrual on 2026-11-20 (period started early today)
    const menstrualPred = PredictiveEngine.calculatePredictions(
      cycles,
      today,
      'menstrual',
      'Started flow'
    );
    expect(menstrualPred.currentCycleDay).toBe(1);
    expect(menstrualPred.currentPhase).toBe('menstrual');
    expect(menstrualPred.predictedPeriodStart).toBe('2026-12-20'); // today + 30 days
    expect(menstrualPred.daysUntilNextPeriod).toBe(30);
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
