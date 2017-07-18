import * as moment from 'moment';

export function isoDate(date: number | Date | moment.Moment) {
  return moment(date).format('YYYY-MM-DD');
}

export function isoDateTime(date: number | Date | moment.Moment) {
  return moment(date).format();
}

export function hmmTime(date: number | Date | moment.Moment) {
  return moment(date).format('H:mm');
}

export function hmmaTime(date: number | Date | moment.Moment) {
  return moment(date).format('h:mm A');
}

export function timestamp(date: Date | moment.Moment | string) {
  return moment(date).valueOf();
}

export function dateTimestamp(date: number | Date | moment.Moment | string) {
  return moment(date).startOf('day').valueOf();
}

export function jsDate(date: number | Date | moment.Moment | string) {
  return moment(date).toDate();
}
