import { describe, it, expect } from 'vitest';
import { LocalNotificationScheduler } from '../../src/services/notifications/localScheduler';
import { PartnerPayload } from '../../src/services/sync/e2ee';

describe('Partner Mode & Local Notification Scheduler (Zero-Knowledge)', () => {
  it('should compute discrete local alert dates ahead of key shifts', () => {
    const payload: PartnerPayload = {
      cycleDay: 23,
      phase: 'luteal',
      countdownDays: 5,
      energyForecast: 'Gentle winding down',
    };

    // Current date is 2026-10-22. Countdown is 5 days -> Next period starts 2026-10-27.
    const alerts = LocalNotificationScheduler.calculateDiscreetAlerts(
      payload,
      '2026-10-22'
    );

    expect(alerts.length).toBeGreaterThanOrEqual(1);

    // Period alert should be scheduled 2 days before period start (2026-10-25)
    const periodAlert = alerts.find((a) => a.type === 'upcoming_period');
    expect(periodAlert).toBeDefined();
    expect(periodAlert?.date).toBe('2026-10-25');
    // Notification copy must be discrete and privacy-conscious (no clinical exposure)
    expect(periodAlert?.body).not.toMatch(/bleeding|vagina|menstruation/i);
    expect(periodAlert?.body).toMatch(/cycle shift|comfort|check in/i);
  });
});
