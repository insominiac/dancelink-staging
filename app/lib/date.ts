export function isEmptyDate(value: string | Date | null | undefined): boolean {
  if (!value) return true;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return true;
  // Treat Unix epoch as empty/default (1970-01-01)
  return d.getTime() === 0;
}

export function formatDateSafe(value: string | Date | null | undefined, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  if (isEmptyDate(value)) return '';
  const d = value instanceof Date ? value : new Date(value as string);
  return d.toLocaleDateString(locale, options);
}

export function formatDateRangeSafe(start: string | Date | null | undefined, end: string | Date | null | undefined, locale: string = 'en-US'): string {
  const startEmpty = isEmptyDate(start);
  const endEmpty = isEmptyDate(end);
  if (startEmpty && endEmpty) return '';
  if (!startEmpty && !endEmpty) {
    const s = new Date(start as any);
    const e = new Date(end as any);
    if (s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return `${s.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  // Only one side present
  if (!startEmpty) return formatDateSafe(start, locale, { month: 'short', day: 'numeric', year: 'numeric' });
  if (!endEmpty) return formatDateSafe(end, locale, { month: 'short', day: 'numeric', year: 'numeric' });
  return '';
}

// Format a recurring schedule like "Every Fri 8:00 PM" or "Every Mon, Wed 7:30 PM"
export function formatRecurringSchedule(scheduleDays: string | null | undefined, scheduleTime: string | null | undefined, locale: string = 'en-US'): string {
  const daysStr = (scheduleDays || '').trim();
  const timeStr = (scheduleTime || '').trim();
  if (!daysStr && !timeStr) return '';

  const dayMap: Record<string, string> = {
    sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat',
    sun: 'Sun', mon: 'Mon', tue: 'Tue', tues: 'Tue', wed: 'Wed', thu: 'Thu', thur: 'Thu', thurs: 'Thu', fri: 'Fri', sat: 'Sat'
  };

  const normalizeDay = (d: string) => {
    const clean = d.replace(/\b(every|each)\b/gi, '').replace(/s$/i, '').trim();
    const key = clean.toLowerCase();
    return dayMap[key] || (clean ? clean.slice(0, 3) : '');
  };

  const days = daysStr
    .split(/[,/&]|\band\b/i)
    .map(s => s.trim())
    .filter(Boolean)
    .map(normalizeDay)
    .filter(Boolean);

  const formatTime = (t: string): string => {
    if (!t) return '';
    const ampmMatch = t.match(/^(\d{1,2})(?::?(\d{2}))?\s*(am|pm)$/i);
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1], 10);
      const m = ampmMatch[2] ? ampmMatch[2] : '00';
      const ap = ampmMatch[3].toUpperCase();
      h = ((h - 1) % 12) + 1; // clamp 1-12
      return `${h}:${m} ${ap}`;
    }
    const h24 = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (h24) {
      const h = parseInt(h24[1], 10);
      const m = h24[2];
      const ap = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${m} ${ap}`;
    }
    // Fallback: try Date parsing
    const d = new Date(`1970-01-01T${t}`);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return t; // as-is
  };

  const time = formatTime(timeStr);
  const daysPart = days.length ? days.join(', ') : '';
  const parts = [daysPart, time].filter(Boolean).join(' ');
  return parts ? `Every ${parts}` : '';
}
