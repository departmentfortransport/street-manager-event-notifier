import * as moment from 'moment-timezone'

export const UK_LOCALE = 'Europe/London'

export function buildDateString(date: Date): string {
  return moment.tz(date, UK_LOCALE).format('DD-MM-YYYY')
}

export function buildDateTimeString(date: Date): string {
  return moment.tz(date, UK_LOCALE).format('DD-MM-YYYY HH:mm')
}

export function buildTimeString(date: Date): string {
  return moment.tz(date, UK_LOCALE).format('HH:mm')
}
