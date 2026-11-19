import { describe, it, expect } from 'vitest';
import { MigrationService } from '../../src/services/migration/importer';

describe('Historical Data Migration Engine', () => {
  it('should parse Flo CSV export and compute baseline cycle metrics', () => {
    const floCsv = `Start date,End date,Cycle length,Period length
2026-06-01,2026-06-05,28,5
2026-06-29,2026-07-04,30,6
2026-07-29,2026-08-02,28,5
2026-08-26,2026-08-30,29,5`;

    const result = MigrationService.importData(floCsv, 'flo_csv');
    expect(result.cycles.length).toBe(4);
    expect(result.cycles[0].startDate).toBe('2026-08-26'); // Recent first
    expect(result.baseline.averageCycleLengthDays).toBe(29); // (28+30+28+29)/4 ≈ 28.75 -> 29
    expect(result.baseline.averagePeriodLengthDays).toBe(5);
    expect(result.baseline.regularityScore).toBeGreaterThan(80);
  });

  it('should parse Clue JSON export with cycle entries and symptoms', () => {
    const clueJson = JSON.stringify({
      cycles: [
        { start: '2026-07-01', end: '2026-07-05', period_length: 5, cycle_length: 28 },
        { start: '2026-07-29', end: '2026-08-03', period_length: 6, cycle_length: 29 },
      ],
      logs: [
        { date: '2026-07-01', flow: 'heavy', symptoms: ['cramps', 'headache'] },
        { date: '2026-07-02', flow: 'medium', symptoms: ['fatigue'] },
      ],
    });

    const result = MigrationService.importData(clueJson, 'clue_json');
    expect(result.cycles.length).toBe(2);
    expect(result.logs.length).toBe(2);
    expect(result.logs[0].symptoms).toContain('cramps');
    expect(result.baseline.totalCyclesAnalyzed).toBe(2);
  });

  it('should parse Apple Health XML export for HKCategoryTypeIdentifierMenstrualFlow', () => {
    const appleHealthXml = `<?xml version="1.0" encoding="UTF-8"?>
<HealthData>
  <Record type="HKCategoryTypeIdentifierMenstrualFlow" startDate="2026-08-01 08:00:00" endDate="2026-08-01 20:00:00" value="HKCategoryValueMenstrualFlowMedium"/>
  <Record type="HKCategoryTypeIdentifierMenstrualFlow" startDate="2026-08-02 08:00:00" endDate="2026-08-02 20:00:00" value="HKCategoryValueMenstrualFlowLight"/>
  <Record type="HKCategoryTypeIdentifierMenstrualFlow" startDate="2026-08-03 08:00:00" endDate="2026-08-03 20:00:00" value="HKCategoryValueMenstrualFlowLight"/>
  <Record type="HKCategoryTypeIdentifierMenstrualFlow" startDate="2026-08-29 08:00:00" endDate="2026-08-29 20:00:00" value="HKCategoryValueMenstrualFlowHeavy"/>
  <Record type="HKCategoryTypeIdentifierMenstrualFlow" startDate="2026-08-30 08:00:00" endDate="2026-08-30 20:00:00" value="HKCategoryValueMenstrualFlowMedium"/>
</HealthData>`;

    const result = MigrationService.importData(appleHealthXml, 'apple_health_xml');
    expect(result.cycles.length).toBe(2);
    expect(result.cycles[1].startDate).toBe('2026-08-01');
    expect(result.cycles[0].startDate).toBe('2026-08-29');
    expect(result.baseline.averagePeriodLengthDays).toBeGreaterThanOrEqual(2);
  });

  it('should auto-detect format when not explicitly specified', () => {
    const genericCsv = `date,flow,notes
2026-08-01,medium,Day 1
2026-08-02,light,Day 2`;

    const format = MigrationService.detectFormat(genericCsv);
    expect(format).toBe('generic_csv');
  });
});
