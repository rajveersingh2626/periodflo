import { PeriodCycle, DailyLog, PhysicalSymptom, FlowIntensity } from '../../types/cycle';

export class ClueParser {
  public static parseJson(content: string): { cycles: PeriodCycle[]; logs: DailyLog[] } {
    const data = JSON.parse(content);
    const cycles: PeriodCycle[] = [];
    const logs: DailyLog[] = [];

    if (Array.isArray(data.cycles)) {
      for (let i = 0; i < data.cycles.length; i++) {
        const c = data.cycles[i];
        const start = c.start || c.start_date || c.startDate;
        const end = c.end || c.end_date || c.endDate;
        const periodLen = c.period_length || c.periodLength || 5;
        const cycleLen = c.cycle_length || c.cycleLength;

        if (start && end) {
          cycles.push({
            id: `clue-c-${i}-${start}`,
            startDate: start,
            endDate: end,
            periodLengthDays: Number(periodLen),
            cycleLengthDays: cycleLen ? Number(cycleLen) : undefined,
          });
        }
      }
    }

    if (Array.isArray(data.logs)) {
      for (const l of data.logs) {
        if (!l.date) continue;
        const symptoms: PhysicalSymptom[] = [];
        if (Array.isArray(l.symptoms)) {
          for (const s of l.symptoms) {
            const normalized = s.toLowerCase().replace(/[\s-]/g, '_');
            symptoms.push(normalized as PhysicalSymptom);
          }
        }

        logs.push({
          id: `clue-log-${l.date}`,
          date: l.date,
          flowIntensity: (l.flow || 'medium') as FlowIntensity,
          symptoms,
          moods: [],
        });
      }
    }

    return { cycles, logs };
  }
}
