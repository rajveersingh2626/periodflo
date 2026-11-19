import { PeriodCycle, DailyLog, FlowIntensity } from '../../types/cycle';
import { DateHelper } from './dateHelper';

export class AppleHealthParser {
  public static parseXml(content: string): { cycles: PeriodCycle[]; logs: DailyLog[] } {
    const datesMap = new Map<string, FlowIntensity>();

    // Match individual <Record ... /> elements
    const tagRegex = /<Record\s+([^>]+)\/>/gi;
    let tagMatch: RegExpExecArray | null;

    while ((tagMatch = tagRegex.exec(content)) !== null) {
      const attributesStr = tagMatch[1];
      if (!attributesStr.includes('HKCategoryTypeIdentifierMenstrualFlow')) {
        continue;
      }

      // Extract attributes independently of their sequence
      const startDateMatch = attributesStr.match(/startDate="([^"\s]+)[^"]*"/i);
      const valueMatch = attributesStr.match(/value="([^"]+)"/i);

      if (startDateMatch && valueMatch) {
        const rawDate = startDateMatch[1];
        const dateStr = DateHelper.normalizeToISO(rawDate);
        const rawVal = valueMatch[1];

        let flow: FlowIntensity = 'medium';
        if (rawVal.includes('Light') || rawVal.includes('Unspecified')) flow = 'light';
        else if (rawVal.includes('Heavy')) flow = 'heavy';
        else if (rawVal.includes('Medium')) flow = 'medium';

        datesMap.set(dateStr, flow);
      }
    }

    const sortedDates = Array.from(datesMap.keys()).sort();
    const cycles: PeriodCycle[] = [];
    const logs: DailyLog[] = [];

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
        const diffDays = DateHelper.diffDays(lastDate, d);

        if (diffDays <= 2) {
          currentPeriod.push(d);
        } else {
          const start = currentPeriod[0];
          const end = currentPeriod[currentPeriod.length - 1];
          cycles.push({
            id: `apple-c-${start}`,
            startDate: start,
            endDate: end,
            periodLengthDays: Math.max(1, DateHelper.diffDays(start, end) + 1),
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
        periodLengthDays: Math.max(1, DateHelper.diffDays(start, end) + 1),
      });
    }

    return { cycles, logs };
  }
}
