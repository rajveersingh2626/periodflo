export class DateHelper {
  /**
   * Normalizes any date string (ISO, MM/DD/YYYY, DD/MM/YYYY, ISO timestamp) to standard ISO YYYY-MM-DD
   */
  public static normalizeToISO(raw: string): string {
    const trimmed = raw.trim();
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }

    // Handles MM/DD/YYYY or DD/MM/YYYY
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        let p1 = parseInt(parts[0], 10);
        let p2 = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;

        // If p1 > 12, it's definitely DD/MM/YYYY
        let month = p1;
        let day = p2;
        if (p1 > 12) {
          day = p1;
          month = p2;
        }

        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    // Fallback to JS Date parsing
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }

    // Return today as safe absolute fallback
    return new Date().toISOString().split('T')[0];
  }

  public static addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
  }

  public static diffDays(aStr: string, bStr: string): number {
    const a = new Date(aStr + 'T00:00:00Z').getTime();
    const b = new Date(bStr + 'T00:00:00Z').getTime();
    return Math.round((b - a) / 86400000);
  }
}
