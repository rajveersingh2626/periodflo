import { PartnerPayload } from '../sync/e2ee';
import { PredictiveEngine } from '../predictions/engine';

export interface DiscreetAlert {
  id: string;
  type: 'upcoming_period' | 'pms_onset' | 'energy_boost';
  date: string; // YYYY-MM-DD
  title: string;
  body: string;
}

export class LocalNotificationScheduler {
  /**
   * Generates privacy-conscious local OS notifications based strictly on decrypted partner payload
   */
  public static calculateDiscreetAlerts(
    payload: PartnerPayload,
    asOfDateStr: string = new Date().toISOString().split('T')[0]
  ): DiscreetAlert[] {
    const alerts: DiscreetAlert[] = [];

    if (typeof payload.countdownDays === 'number' && payload.countdownDays > 0) {
      // Projected period date = asOfDate + countdownDays
      const projectedPeriodDate = PredictiveEngine.addDays(asOfDateStr, payload.countdownDays);

      // Alert 2 days before period
      if (payload.countdownDays >= 2) {
        const twoDaysBefore = PredictiveEngine.addDays(projectedPeriodDate, -2);
        alerts.push({
          id: `alert-period-${twoDaysBefore}`,
          type: 'upcoming_period',
          date: twoDaysBefore,
          title: 'PeriodFLO Update',
          body: 'A cycle shift is approaching in 2 days. Great time to offer extra comfort or an easy evening.',
        });
      }

      // PMS onset alert (4 days before period start)
      if (payload.countdownDays >= 4) {
        const fourDaysBefore = PredictiveEngine.addDays(projectedPeriodDate, -4);
        alerts.push({
          id: `alert-pms-${fourDaysBefore}`,
          type: 'pms_onset',
          date: fourDaysBefore,
          title: 'PeriodFLO Update',
          body: 'Energy may dip slightly over the next few days. Remember to be patient and encouraging.',
        });
      }
    }

    return alerts;
  }
}
