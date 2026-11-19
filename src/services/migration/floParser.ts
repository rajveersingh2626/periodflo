import { PeriodCycle } from '../../types/cycle';
import { DateHelper } from './dateHelper';

export class FloParser {
  public static parseCsv(content: string): PeriodCycle[] {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const cycles: PeriodCycle[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

      const rawStart = cols[0];
      const rawEnd = cols[1];

      if (!rawStart) continue;

      const startDate = DateHelper.normalizeToISO(rawStart);
      // Fallback: if endDate is missing, assume 5-day default period
      const endDate = rawEnd
        ? DateHelper.normalizeToISO(rawEnd)
        : DateHelper.addDays(startDate, 4);

      const cycleLength = cols[2] ? parseInt(cols[2], 10) : undefined;
      const periodLength = cols[3]
        ? parseInt(cols[3], 10)
        : Math.max(1, DateHelper.diffDays(startDate, endDate) + 1);

      cycles.push({
        id: `flo-${i}-${startDate}`,
        startDate,
        endDate,
        cycleLengthDays: isNaN(cycleLength as number) ? undefined : cycleLength,
        periodLengthDays: isNaN(periodLength) ? 5 : periodLength,
      });
    }

    return cycles;
  }
}
