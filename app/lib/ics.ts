// Lightweight ICS generator without external deps
// Produces VCALENDAR with single VEVENT and optional CANCEL method

const BRAND_NAME = process.env.EMAIL_BRAND_NAME || 'DanceLink'

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatICSDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  return `${y}${m}${day}T${hh}${mm}${ss}`
}

function formatICSDateUTC(d: Date): string {
  return formatICSDateLocal(new Date(d.getTime() - d.getTimezoneOffset() * 60000)) + 'Z'
}

function esc(text?: string) {
  if (!text) return ''
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export function createBookingICS(params: {
  uid: string
  title: string
  description?: string
  location?: string
  start: Date
  end?: Date
  timezone?: string
  url?: string
  organizerName?: string
  organizerEmail?: string
  method?: 'REQUEST' | 'CANCEL'
  sequence?: number
  status?: 'CONFIRMED' | 'CANCELLED'
}): string {
  const {
    uid,
    title,
    description,
    location,
    start,
    end,
    timezone = 'UTC',
    url,
    organizerName = BRAND_NAME,
    organizerEmail,
    method = 'REQUEST',
    sequence = 1,
    status = method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED',
  } = params

  const nowUtc = formatICSDateUTC(new Date())
  const useTZID = timezone && timezone !== 'UTC'

  const dtStart = useTZID
    ? `DTSTART;TZID=${timezone}:${formatICSDateLocal(start)}`
    : `DTSTART:${formatICSDateUTC(start)}`

  const dtEnd = end
    ? (useTZID
        ? `DTEND;TZID=${timezone}:${formatICSDateLocal(end)}`
        : `DTEND:${formatICSDateUTC(end)}`)
    : ''

  const lines: string[] = []
  lines.push('BEGIN:VCALENDAR')
  lines.push('VERSION:2.0')
  lines.push(`PRODID:-//${BRAND_NAME}//Calendar//EN`)
  lines.push(`METHOD:${method}`)
  lines.push(`X-WR-CALNAME:${esc(BRAND_NAME)} Bookings`)
  if (timezone) lines.push(`X-WR-TIMEZONE:${timezone}`)
  lines.push('BEGIN:VEVENT')
  lines.push(`UID:${esc(uid)}`)
  lines.push(`DTSTAMP:${nowUtc}`)
  lines.push(dtStart)
  if (dtEnd) lines.push(dtEnd)
  lines.push(`SEQUENCE:${sequence}`)
  lines.push(`STATUS:${status}`)
  lines.push(`SUMMARY:${esc(title)}`)
  if (description) lines.push(`DESCRIPTION:${esc(description)}`)
  if (location) lines.push(`LOCATION:${esc(location)}`)
  if (url) lines.push(`URL:${esc(url)}`)
  if (organizerEmail) {
    const cn = esc(organizerName || '')
    lines.push(`ORGANIZER;CN=${cn}:mailto:${organizerEmail}`)
  }
  lines.push('END:VEVENT')
  lines.push('END:VCALENDAR')

  return lines.join('\r\n')
}
