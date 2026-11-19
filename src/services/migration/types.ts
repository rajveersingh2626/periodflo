import { PeriodCycle, DailyLog, CycleBaseline } from '../../types/cycle';

export type MigrationFormat =
  | 'flo_csv'
  | 'flo_json'
  | 'clue_json'
  | 'clue_csv'
  | 'apple_health_xml'
  | 'generic_csv'
  | 'generic_json';

export interface MigrationResult {
  cycles: PeriodCycle[];
  logs: DailyLog[];
  baseline: CycleBaseline;
}
