import { PeriodCycle, CyclePrediction, CyclePhase } from '../../types/cycle';
import { PhaseHelper } from './phases';

export class PredictiveEngine {
  /**
   * Helper to format Date to ISO YYYY-MM-DD
   */
  public static formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  /**
   * Helper to add days to a date string YYYY-MM-DD
   */
  public static addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return this.formatDate(d);
  }

  /**
   * Calculate difference in full calendar days between two YYYY-MM-DD dates (b - a)
   */
  public static diffDays(aStr: string, bStr: string): number {
    const a = new Date(aStr + 'T00:00:00Z').getTime();
    const b = new Date(bStr + 'T00:00:00Z').getTime();
    return Math.round((b - a) / 86400000);
  }

  /**
   * Calculates comprehensive predictions based on historical cycles and an anchor date
   */
  public static calculatePredictions(
    cycles: PeriodCycle[],
    asOfDateStr: string = this.formatDate(new Date())
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
        currentPhase: 'menstrual',
        daysUntilNextPeriod: 28,
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

    // Predict next period start
    const predictedPeriodStart = this.addDays(latestCycle.startDate, avgCycleLength);
    const predictedPeriodEnd = this.addDays(predictedPeriodStart, avgPeriodLength);

    // Standard luteal phase is 14 days
    const lutealPhaseDays = 14;
    const ovulationDate = this.addDays(predictedPeriodStart, -lutealPhaseDays);
    const fertileWindowStart = this.addDays(ovulationDate, -5);
    const fertileWindowEnd = this.addDays(ovulationDate, 1);

    // Ovulation cycle day
    const ovulationCycleDay = avgCycleLength - lutealPhaseDays;
    const currentPhase = PhaseHelper.getPhaseForDay(
      currentCycleDay,
      latestCycle.periodLengthDays || avgPeriodLength,
      ovulationCycleDay
    );

    const daysUntilNextPeriod = Math.max(0, this.diffDays(asOfDateStr, predictedPeriodStart));

    return {
      predictedPeriodStart,
      predictedPeriodEnd,
      predictedPeriodLengthDays: avgPeriodLength,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd,
      currentCycleDay,
      currentPhase,
      daysUntilNextPeriod,
    };
  }
}
