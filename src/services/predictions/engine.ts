import { PeriodCycle, CyclePrediction, CyclePhase } from '../../types/cycle';
import { PhaseHelper } from './phases';

export class PredictiveEngine {
  /**
   * Helper to format Date to ISO YYYY-MM-DD using local timezone components
   */
  public static formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Helper to add days to a date string YYYY-MM-DD
   */
  public static addDays(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  }

  /**
   * Calculate difference in full calendar days between two YYYY-MM-DD dates (b - a)
   */
  public static diffDays(aStr: string, bStr: string): number {
    const [y1, m1, d1] = aStr.split('-').map(Number);
    const [y2, m2, d2] = bStr.split('-').map(Number);
    const a = new Date(y1, m1 - 1, d1).getTime();
    const b = new Date(y2, m2 - 1, d2).getTime();
    return Math.round((b - a) / 86400000);
  }

  /**
   * Calculates comprehensive predictions based on historical cycles, an anchor date,
   * and optional body autonomy calibration phase overrides.
   */
  public static calculatePredictions(
    cycles: PeriodCycle[],
    asOfDateStr: string = this.formatDate(new Date()),
    overridePhase?: CyclePhase,
    calibrationReason?: string
  ): CyclePrediction {
    if (cycles.length === 0) {
      // Default standard 28-day cycle starting today
      const defaultStart = asOfDateStr;
      const nextPeriodStart = this.addDays(defaultStart, 28);
      const ovulationDate = this.addDays(nextPeriodStart, -14);

      return {
        predictedPeriodStart: nextPeriodStart,
        predictedPeriodEnd: this.addDays(nextPeriodStart, 5),
        predictedPeriodLengthDays: 5,
        ovulationDate,
        fertileWindowStart: this.addDays(ovulationDate, -5),
        fertileWindowEnd: this.addDays(ovulationDate, 1),
        currentCycleDay: 1,
        currentPhase: overridePhase || 'menstrual',
        daysUntilNextPeriod: 28,
        isPhaseOverridden: !!overridePhase,
        calibratedPhase: overridePhase,
        calibrationReason,
      };
    }

    // Sort descending by startDate so cycles[0] is the most recent
    const sorted = [...cycles].sort((a, b) => b.startDate.localeCompare(a.startDate));
    const latestCycle = sorted[0];

    // Compute weighted rolling average cycle length
    const validLengths = sorted
      .map((c) => c.cycleLengthDays)
      .filter((len): len is number => typeof len === 'number' && len >= 18 && len <= 60);

    let avgCycleLength = 28;
    if (validLengths.length > 0) {
      // Give 2x weight to the most recent 3 cycles
      let totalWeight = 0;
      let weightedSum = 0;
      for (let i = 0; i < validLengths.length; i++) {
        const weight = i < 3 ? 2 : 1;
        weightedSum += validLengths[i] * weight;
        totalWeight += weight;
      }
      avgCycleLength = Math.round(weightedSum / totalWeight);
    }

    // Compute average period length
    const validPeriodLengths = sorted
      .map((c) => c.periodLengthDays)
      .filter((len): len is number => typeof len === 'number' && len > 0 && len <= 14);
    const avgPeriodLength =
      validPeriodLengths.length > 0
        ? Math.round(validPeriodLengths.reduce((a, b) => a + b, 0) / validPeriodLengths.length)
        : 5;

    // Cycle day calculation
    const elapsedSinceStart = this.diffDays(latestCycle.startDate, asOfDateStr);
    const currentCycleDay = Math.max(1, elapsedSinceStart + 1);

    // Baseline algorithmic predictions
    const lutealPhaseDays = 14;
    let predictedPeriodStart = this.addDays(latestCycle.startDate, avgCycleLength);
    let predictedPeriodEnd = this.addDays(predictedPeriodStart, avgPeriodLength);
    let ovulationDate = this.addDays(predictedPeriodStart, -lutealPhaseDays);
    let fertileWindowStart = this.addDays(ovulationDate, -5);
    let fertileWindowEnd = this.addDays(ovulationDate, 1);

    // Ovulation cycle day
    const ovulationCycleDay = avgCycleLength - lutealPhaseDays;
    let currentPhase = PhaseHelper.getPhaseForDay(
      currentCycleDay,
      latestCycle.periodLengthDays || avgPeriodLength,
      ovulationCycleDay
    );
    let finalCycleDay = currentCycleDay;

    // AUTO-UPDATE DATES WHEN PHASE IS CALIBRATED BY USER
    if (overridePhase) {
      currentPhase = overridePhase;

      if (overridePhase === 'ovulatory') {
        // In clinical endocrinology, the post-ovulatory luteal phase is biologically constant (~14 days).
        // If the user confirms ovulation today (LH surge, mucus), the next period arrives in 14 days.
        ovulationDate = asOfDateStr;
        fertileWindowStart = this.addDays(asOfDateStr, -5);
        fertileWindowEnd = this.addDays(asOfDateStr, 1);
        predictedPeriodStart = this.addDays(asOfDateStr, 14);
        predictedPeriodEnd = this.addDays(predictedPeriodStart, avgPeriodLength);
      } else if (overridePhase === 'menstrual') {
        // Period started today -> Cycle Day 1 reset
        finalCycleDay = 1;
        predictedPeriodStart = this.addDays(asOfDateStr, avgCycleLength);
        predictedPeriodEnd = this.addDays(predictedPeriodStart, avgPeriodLength);
        ovulationDate = this.addDays(predictedPeriodStart, -lutealPhaseDays);
        fertileWindowStart = this.addDays(ovulationDate, -5);
        fertileWindowEnd = this.addDays(ovulationDate, 1);
      } else if (overridePhase === 'follicular') {
        // Ovulation is delayed, extending the follicular window
        ovulationDate = this.addDays(asOfDateStr, 3);
        fertileWindowStart = this.addDays(ovulationDate, -5);
        fertileWindowEnd = this.addDays(ovulationDate, 1);
        predictedPeriodStart = this.addDays(ovulationDate, 14);
        predictedPeriodEnd = this.addDays(predictedPeriodStart, avgPeriodLength);
      } else if (overridePhase === 'luteal') {
        // Early post-ovulatory phase confirmed
        const remainingLuteal = Math.max(3, Math.min(12, avgCycleLength - currentCycleDay));
        predictedPeriodStart = this.addDays(asOfDateStr, remainingLuteal);
        predictedPeriodEnd = this.addDays(predictedPeriodStart, avgPeriodLength);
      }
    }

    const rawDaysUntil = this.diffDays(asOfDateStr, predictedPeriodStart);
    const isOverdue = rawDaysUntil < 0;
    const daysLate = isOverdue ? Math.abs(rawDaysUntil) : 0;
    const daysUntilNextPeriod = Math.max(0, rawDaysUntil);

    return {
      predictedPeriodStart,
      predictedPeriodEnd,
      predictedPeriodLengthDays: avgPeriodLength,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd,
      currentCycleDay: finalCycleDay,
      currentPhase,
      daysUntilNextPeriod,
      isOverdue,
      daysLate,
      isPhaseOverridden: !!overridePhase,
      calibratedPhase: overridePhase,
      calibrationReason,
    };
  }
}
