import { describe, it, expect } from 'vitest';
import { MigrationService } from '../src/services/migration/importer';
import { PredictiveEngine } from '../src/services/predictions/engine';
import { RelayServer, createRelayApp } from '../server/src/index';
import { E2EESyncService, SharedPermissions } from '../src/services/sync/e2ee';

describe('Code Review Verification Fixes', () => {
  it('should normalize non-ISO date formats (MM/DD/YYYY) without throwing RangeError', () => {
    const csvWithUsDates = `Start date,End date,Cycle length,Period length
06/01/2026,06/05/2026,28,5
06/29/2026,07/04/2026,29,5`;

    expect(() => {
      const result = MigrationService.importData(csvWithUsDates, 'flo_csv');
      expect(result.cycles[0].startDate).toBe('2026-06-29');
      expect(result.cycles[1].startDate).toBe('2026-06-01');

      // Verify that predictions do not crash with RangeError
      const pred = PredictiveEngine.calculatePredictions(result.cycles, '2026-07-15');
      expect(pred.predictedPeriodStart).toBeDefined();
    }).not.toThrow();
  });

  it('should parse Apple Health XML with arbitrary attribute order', () => {
    const xmlReordered = `<?xml version="1.0" encoding="UTF-8"?>
<HealthData>
  <Record value="HKCategoryValueMenstrualFlowHeavy" type="HKCategoryTypeIdentifierMenstrualFlow" startDate="2026-09-01T08:00:00Z" />
  <Record startDate="2026-09-02T08:00:00Z" value="HKCategoryValueMenstrualFlowMedium" type="HKCategoryTypeIdentifierMenstrualFlow" />
</HealthData>`;

    const result = MigrationService.importData(xmlReordered, 'apple_health_xml');
    expect(result.cycles.length).toBe(1);
    expect(result.cycles[0].startDate).toBe('2026-09-01');
    expect(result.cycles[0].periodLengthDays).toBe(2);
  });

  it('should identify overdue cycles and calculate days late', () => {
    const cycles = [
      {
        id: 'c1',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        cycleLengthDays: 28,
        periodLengthDays: 5,
      },
    ];

    // Next period was predicted on 2026-09-29.
    // If today is 2026-10-05, it is 6 days late!
    const pred = PredictiveEngine.calculatePredictions(cycles, '2026-10-05');
    expect(pred.isOverdue).toBe(true);
    expect(pred.daysLate).toBe(6);
  });

  it('should correctly rate-limit repeat rendezvous requests after 3 failed attempts', () => {
    const relay = new RelayServer();
    const clientId = 'ip-test-123';

    expect(relay.isRateLimited(clientId)).toBe(false); // 1st attempt
    relay.recordFailedAttempt(clientId);

    expect(relay.isRateLimited(clientId)).toBe(false); // 2nd attempt
    relay.recordFailedAttempt(clientId);

    expect(relay.isRateLimited(clientId)).toBe(false); // 3rd attempt
    relay.recordFailedAttempt(clientId);

    // 4th attempt is rate-limited
    expect(relay.isRateLimited(clientId)).toBe(true);
  });

  it('should expose functional Hono HTTP relay routes for rendezvous and mailbox', async () => {
    const app = createRelayApp();

    // Register rendezvous
    const resPost = await app.request('/rendezvous', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'TEST99',
        mailboxId: 'box-99',
        publicKey: 'pub-99',
      }),
    });
    expect(resPost.status).toBe(200);

    // Claim rendezvous
    const resGet = await app.request('/rendezvous/TEST99');
    expect(resGet.status).toBe(200);
    const data = await resGet.json();
    expect(data.mailboxId).toBe('box-99');

    // Claiming again returns 404 (single use)
    const resGet2 = await app.request('/rendezvous/TEST99');
    expect(resGet2.status).toBe(404);
  });
});
