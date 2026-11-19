import { describe, it, expect } from 'vitest';
import { DeviceBackupParser } from '../../src/services/migration/deviceBackupParser';
import { MigrationService } from '../../src/services/migration/importer';
import { dbService } from '../../src/services/storage/db';
import { SUHANI_CYCLES, SUHANI_LOGS, SUHANI_PROFILE } from '../../src/services/storage/suhaniData';

describe('DeviceBackupParser & Suhani Data Migration', () => {
  it('correctly formats YYYYMMDD numeric keys into ISO YYYY-MM-DD', () => {
    expect(DeviceBackupParser.formatDateKey(20261102)).toBe('2026-11-02');
    expect(DeviceBackupParser.formatDateKey(20221119)).toBe('2022-11-19');
    expect(DeviceBackupParser.formatDateKey(20260105)).toBe('2026-01-05');
  });

  it('parses raw cycleList into chronological PeriodCycle array with derived cycle lengths', () => {
    const rawCycles = [
      { cycleStartDate: 20261102, cycleEndDate: 20261105 },
      { cycleStartDate: 20261003, cycleEndDate: 20261007 },
      { cycleStartDate: 20260904, cycleEndDate: 20260908 },
    ];

    const parsed = DeviceBackupParser.parseCycles(rawCycles);
    expect(parsed.length).toBe(3);
    expect(parsed[0].startDate).toBe('2026-11-02');
    expect(parsed[0].periodLengthDays).toBe(4);
    // Cycle length for 2026-10-03 to 2026-11-02 is 30 days
    expect(parsed[1].cycleLengthDays).toBe(30);
    // Cycle length for 2026-09-04 to 2026-10-03 is 29 days
    expect(parsed[2].cycleLengthDays).toBe(29);
  });

  it('maps raw symptoms, moods, and flows into domain types', () => {
    const rawEntries = [
      {
        entrydatekey: 20260806,
        pStartedToday: 1,
        flow: 2,
        symptoms: 'acramps,fatigue,bloating,backaches',
        moods: 'exhausted,emotional',
      },
      {
        entrydatekey: 20260829,
        symptoms: 'backaches',
        moods: 'impatient,frustrated,grumpy,cranky,anxious,panicky',
      },
      {
        entrydatekey: 20261101,
        symptoms: 'irritability,cravings',
      },
    ];

    const logs = DeviceBackupParser.parseDayEntries(rawEntries);
    expect(logs.length).toBe(3);

    const periodLog = logs.find((l) => l.date === '2026-08-06')!;
    expect(periodLog.flowIntensity).toBe('medium');
    expect(periodLog.symptoms).toContain('cramps');
    expect(periodLog.symptoms).toContain('fatigue');
    expect(periodLog.symptoms).toContain('bloating');
    expect(periodLog.symptoms).toContain('backache');
    expect(periodLog.moods).toContain('low_energy');
    expect(periodLog.moods).toContain('sensitive');

    const pmsLog = logs.find((l) => l.date === '2026-08-29')!;
    expect(pmsLog.symptoms).toContain('backache');
    expect(pmsLog.moods).toContain('irritable');
    expect(pmsLog.moods).toContain('anxious');

    const prePeriodLog = logs.find((l) => l.date === '2026-11-01')!;
    expect(prePeriodLog.symptoms).toContain('cravings');
    expect(prePeriodLog.moods).toContain('irritable');
  });

  it('detects device_backup_json format in MigrationService', () => {
    const jsonSample = JSON.stringify({
      cycleList: [{ cycleStartDate: 20261102, cycleEndDate: 20261105 }],
      entryList: [{ entrydatekey: 20261102, pStartedToday: 1 }],
    });

    const detected = MigrationService.detectFormat(jsonSample);
    expect(detected).toBe('device_backup_json');

    const imported = MigrationService.importData(jsonSample);
    expect(imported.cycles.length).toBe(1);
    expect(imported.logs.length).toBe(1);
    expect(imported.cycles[0].startDate).toBe('2026-11-02');
  });

  it('verifies Suhani complete dataset properties', () => {
    expect(SUHANI_PROFILE.name).toBe('Suhani');
    expect(SUHANI_PROFILE.averageCycleLengthDays).toBe(30);
    expect(SUHANI_PROFILE.averagePeriodLengthDays).toBe(4);
    expect(SUHANI_CYCLES.length).toBe(47);
    expect(SUHANI_LOGS.length).toBe(106);
    expect(SUHANI_CYCLES[0].startDate).toBe('2026-11-02');
    expect(SUHANI_CYCLES[SUHANI_CYCLES.length - 1].startDate).toBe('2022-11-19');
  });

  it('seeds Suhani data into encrypted database and verifies retrieval', async () => {
    await dbService.wipeDatabase();
    await dbService.seedSuhaniData();

    const loadedCycles = await dbService.getCycles();
    expect(loadedCycles.length).toBe(47);
    expect(loadedCycles[0].startDate).toBe('2026-11-02');

    const loadedLogs = await dbService.getDailyLogs();
    expect(loadedLogs.length).toBe(106);

    const nov1Log = await dbService.getDailyLog('2026-11-01');
    expect(nov1Log).not.toBeNull();
    expect(nov1Log?.symptoms).toContain('cravings');
  });
});
