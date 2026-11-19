import { PeriodCycle } from '../../types/cycle';

export class FloParser {
  public static parseCsv(content: string): PeriodCycle[] {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const header = lines[0].toLowerCase();
    const cycles: PeriodCycle[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

      // Flo usually has: Start date, End date, Cycle length, Period length
      const startDate = cols[0];
      const endDate = cols[1];
      const cycleLength = cols[2] ? parseInt(cols[2], 10) : undefined;
      const periodLength = cols[3]
        ? parseInt(cols[3], 10)
        : Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1);

      if (startDate && endDate) {
        cycles.push({
          id: `flo-${i}-${startDate}`,
          startDate,
          endDate,
          cycleLengthDays: isNaN(cycleLength as number) ? undefined : cycleLength,
          periodLengthDays: isNaN(periodLength) ? 5 : periodLength,
        });
      }
    }

    return cycles;
  }
}
