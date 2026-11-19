import { describe, it, expect, beforeEach } from 'vitest';
import { AppLockService } from '../../src/services/security/appLock';
import { DataExportService } from '../../src/services/export/dataExport';
import { DatabaseService } from '../../src/services/storage/db';

describe('Security, App Lock & Data Sovereignty', () => {
  beforeEach(() => {
    AppLockService.reset();
  });

  it('should enable PIN lock and validate correct/incorrect PINs', () => {
    expect(AppLockService.isLockEnabled()).toBe(false);

    AppLockService.setPin('1234');
    expect(AppLockService.isLockEnabled()).toBe(true);

    // Incorrect PIN
    expect(AppLockService.verifyPin('0000')).toBe(false);

    // Correct PIN
    expect(AppLockService.verifyPin('1234')).toBe(true);
  });

  it('should format all user data for 1-tap JSON and CSV export', async () => {
    const db = new DatabaseService();
    await db.saveCycle({
      id: 'c1',
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      cycleLengthDays: 28,
      periodLengthDays: 5,
    });
    await db.saveDailyLog({
      id: 'log1',
      date: '2026-10-01',
      flowIntensity: 'medium',
      symptoms: ['cramps'],
      moods: ['calm'],
    });

    const exportData = await DataExportService.generateExportData(db);
    expect(exportData.cycles.length).toBe(1);
    expect(exportData.logs.length).toBe(1);

    const jsonString = DataExportService.exportToJson(exportData);
    expect(jsonString).toContain('2026-10-01');

    const csvString = DataExportService.exportToCsv(exportData);
    expect(csvString).toContain('StartDate,EndDate,CycleLength,PeriodLength');
    expect(csvString).toContain('2026-10-01,2026-10-05,28,5');
  });

  it('should cryptographically wipe database on request', async () => {
    const db = new DatabaseService();
    await db.saveCycle({
      id: 'c1',
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      periodLengthDays: 5,
    });

    expect((await db.getCycles()).length).toBe(1);

    await db.wipeDatabase();
    expect((await db.getCycles()).length).toBe(0);
  });
});
