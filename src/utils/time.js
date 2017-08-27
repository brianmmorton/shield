import moment from 'moment-timezone';

export const getStartOfDay = (date, timezone) => moment.tz(date || undefined, timezone).startOf('day').utc();
export const getEndOfDay = (date, timezone) => moment.tz(date || undefined, timezone).endOf('day').utc();
