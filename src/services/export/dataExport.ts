import { DatabaseService } from '../storage/db';
import { PeriodCycle, DailyLog } from '../../types/cycle';

export interface ExportDataPayload {
  version: string;
  exportedAt: string;
  cycles: PeriodCycle[];
  logs: DailyLog[];
}

export class DataExportService {
  public static async generateExportData(db: DatabaseService): Promise<ExportDataPayload> {
    const cycles = await db.getCycles();
    const logs = await db.getDailyLogs();

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      cycles,
      logs,
    };
  }

  public static exportToJson(payload: ExportDataPayload): string {
    return JSON.stringify(payload, null, 2);
  }

  public static exportToCsv(payload: ExportDataPayload): string {
    const lines = ['StartDate,EndDate,CycleLength,PeriodLength'];
    for (const c of payload.cycles) {
      lines.push(`${c.startDate},${c.endDate},${c.cycleLengthDays || ''},${c.periodLengthDays}`);
    }
    return lines.join('\n');
  }
}
