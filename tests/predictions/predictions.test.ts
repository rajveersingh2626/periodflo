import { describe, it, expect } from 'vitest';
import { PredictiveEngine } from '../../src/services/predictions/engine';
import { PeriodCycle } from '../../src/types/cycle';

describe('Predictive Cycle Intelligence & Recalculation Engine', () => {
  const sampleCycles: PeriodCycle[] = [
    {
      id: 'c3',
      startDate: '2026-09-29',
      endDate: '2026-10-03',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    },
    {
      id: 'c2',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    },
    {
      id: 'c1',
      startDate: '2026-08-04',
      endDate: '2026-08-08',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    },
  ];

  it('should accurately predict next period, ovulation day, and fertile window', () => {
    // Current date: 2026-10-10 (Day 12 of cycle starting 2026-09-29)
    const asOfDate = '2026-10-10';
    const prediction = PredictiveEngine.calculatePredictions(sampleCycles, asOfDate);

    // Last start was 2026-09-29 + 28 days = 2026-10-27
    expect(prediction.predictedPeriodStart).toBe('2026-10-27');
    expect(prediction.predictedPeriodLengthDays).toBe(5);

    // Ovulation = Next Period (2026-10-27) - 14 days luteal phase = 2026-10-13
    expect(prediction.ovulationDate).toBe('2026-10-13');

    // Fertile window = Ovulation - 5 days (2026-10-08) through Ovulation + 1 day (2026-10-14)
    expect(prediction.fertileWindowStart).toBe('2026-10-08');
    expect(prediction.fertileWindowEnd).toBe('2026-10-14');

    expect(prediction.currentCycleDay).toBe(12);
    expect(prediction.currentPhase).toBe('follicular');
    expect(prediction.daysUntilNextPeriod).toBe(17);
  });

  it('should recalculate immediately when a period starts early', () => {
    // Suppose a new period starts on 2026-10-24 (3 days early instead of 2026-10-27)
    const earlyCycles: PeriodCycle[] = [
      {
        id: 'c4-early',
        startDate: '2026-10-24',
        endDate: '2026-10-28',
        periodLengthDays: 5,
      },
      ...sampleCycles,
    ];

    const asOfDate = '2026-10-25'; // Day 2 of the early period
    const prediction = PredictiveEngine.calculatePredictions(earlyCycles, asOfDate);

    expect(prediction.currentCycleDay).toBe(2);
    expect(prediction.currentPhase).toBe('menstrual');

    // Next period recalculates from the new early start date: 2026-10-24 + ~28 days = 2026-11-21
    expect(prediction.predictedPeriodStart).toBe('2026-11-21');
  });

  it('should detect phases accurately across the cycle', () => {
    const cycleStart = '2026-10-01';
    const singleCycle: PeriodCycle[] = [
      {
        id: 'c1',
        startDate: cycleStart,
        endDate: '2026-10-05',
        cycleLengthDays: 28,
        periodLengthDays: 5,
      },
    ];

    // Day 3 (2026-10-03) -> Menstrual
    expect(PredictiveEngine.calculatePredictions(singleCycle, '2026-10-03').currentPhase).toBe(
      'menstrual'
    );

    // Day 8 (2026-10-08) -> Follicular
    expect(PredictiveEngine.calculatePredictions(singleCycle, '2026-10-08').currentPhase).toBe(
      'follicular'
    );

    // Day 14 (2026-10-14) -> Ovulatory
    expect(PredictiveEngine.calculatePredictions(singleCycle, '2026-10-14').currentPhase).toBe(
      'ovulatory'
    );

    // Day 22 (2026-10-22) -> Luteal
    expect(PredictiveEngine.calculatePredictions(singleCycle, '2026-10-22').currentPhase).toBe(
      'luteal'
    );
  });
});
