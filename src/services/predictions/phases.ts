import { CyclePhase } from '../../types/cycle';

export class PhaseHelper {
  /**
   * Determines current hormonal cycle phase based on cycle day, period length, and ovulation day
   */
  public static getPhaseForDay(
    cycleDay: number,
    periodLength: number,
    ovulationDay: number
  ): CyclePhase {
    if (cycleDay <= periodLength) {
      return 'menstrual';
    }
    // Fertile peak & ovulation: 1 day before ovulation through 1 day after
    if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) {
      return 'ovulatory';
    }
    if (cycleDay < ovulationDay - 1) {
      return 'follicular';
    }
    return 'luteal';
  }

  /**
   * Returns human-readable label and description of phase
   */
  public static getPhaseMetadata(phase: CyclePhase): { title: string; subtitle: string } {
    switch (phase) {
      case 'menstrual':
        return {
          title: 'Menstrual Phase',
          subtitle: 'Rest, renewal, and gentle recharge',
        };
      case 'follicular':
        return {
          title: 'Follicular Phase',
          subtitle: 'Rising energy, curiosity, and fresh beginnings',
        };
      case 'ovulatory':
        return {
          title: 'Ovulatory Phase',
          subtitle: 'Peak confidence, magnetic communication, and vitality',
        };
      case 'luteal':
        return {
          title: 'Luteal Phase',
          subtitle: 'Winding down, inner focus, and cozy comfort',
        };
    }
  }
}
