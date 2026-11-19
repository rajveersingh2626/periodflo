import { PeriodCycle, DailyLog, CycleBaseline } from '../../types/cycle';
import { MigrationFormat, MigrationResult } from './types';
import { FloParser } from './floParser';
import { ClueParser } from './clueParser';
import { AppleHealthParser } from './appleHealthParser';

export class MigrationService {
  public static detectFormat(content: string): MigrationFormat {
    const trimmed = content.trim();
    if (trimmed.startsWith('<?xml') || trimmed.includes('<HealthData>')) {
      return 'apple_health_xml';
    }
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      if (trimmed.includes('clue') || (trimmed.includes('cycles') && trimmed.includes('period_length'))) {
        return 'clue_json';
      }
      return 'generic_json';
    }
    // CSV detection
    const firstLine = trimmed.split('\n')[0].toLowerCase();
    if (firstLine.includes('cycle length') || firstLine.includes('period length')) {
      return 'flo_csv';
    }
    return 'generic_csv';
  }

  public static importData(content: string, format?: MigrationFormat): MigrationResult {
    const resolvedFormat = format || this.detectFormat(content);
    let cycles: PeriodCycle[] = [];
    let logs: DailyLog[] = [];

    switch (resolvedFormat) {
      case 'flo_csv':
        cycles = FloParser.parseCsv(content);
        break;
      case 'clue_json': {
        const parsed = ClueParser.parseJson(content);
        cycles = parsed.cycles;
        logs = parsed.logs;
        break;
      }
      case 'apple_health_xml': {
        const parsed = AppleHealthParser.parseXml(content);
        cycles = parsed.cycles;
        logs = parsed.logs;
        break;
      }
      case 'generic_csv':
      default: {
        const lines = content.trim().split(/\r?\n/);
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim());
          if (cols[0]) {
            logs.push({
              id: `gen-log-${cols[0]}`,
              date: cols[0],
              flowIntensity: (cols[1] || 'medium') as any,
              symptoms: [],
              moods: [],
              notes: cols[2],
            });
          }
        }
        break;
      }
    }

    // Sort cycles descending by start date
    cycles.sort((a, b) => b.startDate.localeCompare(a.startDate));

    // Calculate cycle lengths if missing
    for (let i = 0; i < cycles.length - 1; i++) {
      if (!cycles[i + 1].cycleLengthDays) {
        const currentStart = new Date(cycles[i].startDate).getTime();
        const previousStart = new Date(cycles[i + 1].startDate).getTime();
        const diffDays = Math.round((currentStart - previousStart) / 86400000);
        if (diffDays >= 18 && diffDays <= 60) {
          cycles[i + 1].cycleLengthDays = diffDays;
        }
      }
    }

    const baseline = this.calculateBaseline(cycles);

    return {
      cycles,
      logs,
      baseline,
    };
  }

  public static calculateBaseline(cycles: PeriodCycle[]): CycleBaseline {
    if (cycles.length === 0) {
      return {
        averageCycleLengthDays: 28,
        averagePeriodLengthDays: 5,
        estimatedLutealPhaseDays: 14,
        regularityScore: 100,
        totalCyclesAnalyzed: 0,
      };
    }

    const validCycleLengths = cycles
      .map((c) => c.cycleLengthDays)
      .filter((len): len is number => typeof len === 'number' && len >= 18 && len <= 60);

    const validPeriodLengths = cycles
      .map((c) => c.periodLengthDays)
      .filter((len): len is number => typeof len === 'number' && len > 0 && len <= 14);

    const avgCycle =
      validCycleLengths.length > 0
        ? Math.round(validCycleLengths.reduce((a, b) => a + b, 0) / validCycleLengths.length)
        : 28;

    const avgPeriod =
      validPeriodLengths.length > 0
        ? Math.round(validPeriodLengths.reduce((a, b) => a + b, 0) / validPeriodLengths.length)
        : 5;

    // Regularity score: lower standard deviation = higher score
    let variance = 0;
    if (validCycleLengths.length > 1) {
      variance =
        validCycleLengths.reduce((acc, len) => acc + Math.pow(len - avgCycle, 2), 0) /
        validCycleLengths.length;
    }
    const stdDev = Math.sqrt(variance);
    // stdDev of 0 -> 100%, stdDev of 5 -> 75%, stdDev >= 10 -> 50% or less
    const regularityScore = Math.max(20, Math.min(100, Math.round(100 - stdDev * 5)));

    return {
      averageCycleLengthDays: avgCycle,
      averagePeriodLengthDays: avgPeriod,
      estimatedLutealPhaseDays: 14, // Clinical baseline
      regularityScore,
      totalCyclesAnalyzed: cycles.length,
    };
  }
}
