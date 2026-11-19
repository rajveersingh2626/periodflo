import { PeriodCycle, DailyLog, FlowIntensity } from '../../types/cycle';

export class AppleHealthParser {
  public static parseXml(content: string): { cycles: PeriodCycle[]; logs: DailyLog[] } {
    const recordRegex =
      /<Record[^>]*type="HKCategoryTypeIdentifierMenstrualFlow"[^>]*startDate="([^"\s]+)[^"]*"[^>]*value="([^"]+)"/g;

    const datesMap = new Map<string, FlowIntensity>();
    let match: RegExpExecArray | null;

    while ((match = recordRegex.exec(content)) !== null) {
      const dateStr = match[1]; // e.g. 2026-08-01
      const rawVal = match[2]; // e.g. HKCategoryValueMenstrualFlowMedium

      let flow: FlowIntensity = 'medium';
      if (rawVal.includes('Light') || rawVal.includes('Unspecified')) flow = 'light';
      else if (rawVal.includes('Heavy')) flow = 'heavy';
      else if (rawVal.includes('Medium')) flow = 'medium';

      datesMap.set(dateStr, flow);
    }

    const sortedDates = Array.from(datesMap.keys()).sort();
    const cycles: PeriodCycle[] = [];
    const logs: DailyLog[] = [];

    // Group dates into periods (consecutive days or gap <= 2 days)
    let currentPeriod: string[] = [];

    for (const d of sortedDates) {
      logs.push({
        id: `apple-log-${d}`,
        date: d,
        flowIntensity: datesMap.get(d),
        symptoms: [],
        moods: [],
      });

      if (currentPeriod.length === 0) {
        currentPeriod.push(d);
      } else {
        const lastDate = currentPeriod[currentPeriod.length - 1];
        const diffDays = Math.round(
          (new Date(d).getTime() - new Date(lastDate).getTime()) / 86400000
        );

        if (diffDays <= 2) {
          currentPeriod.push(d);
        } else {
          // Finish previous period
          const start = currentPeriod[0];
          const end = currentPeriod[currentPeriod.length - 1];
          cycles.push({
            id: `apple-c-${start}`,
            startDate: start,
            endDate: end,
            periodLengthDays: Math.max(
              1,
              Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1
            ),
          });
          currentPeriod = [d];
        }
      }
    }

    if (currentPeriod.length > 0) {
      const start = currentPeriod[0];
      const end = currentPeriod[currentPeriod.length - 1];
      cycles.push({
        id: `apple-c-${start}`,
        startDate: start,
        endDate: end,
        periodLengthDays: Math.max(
          1,
          Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1
        ),
      });
    }

    return { cycles, logs };
  }
}
