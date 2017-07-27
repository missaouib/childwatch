import {
  serverToClient, clientToServer, convertStartToString, convertEndToString,
  orderByEffDate, convertToNumber, orderByWeekdays, timesValid, isStartBeforeEnd
} from './schedule.service';

import {
  emptyClientSchedule, emptyServerSchedule, empty2DayClientSchedule,
  empty2DayServerSchedule, filledOutCS, filledOutSS, complexCS, complexSS, orderedByJuly5,
  orderedMthroughS, fifthOfJuly2017, daySchedule1, daySchedule4, daySchedule2, daySchedule3
} from '../../sample-data/recurring-schedule-data';

describe('ScheduleService', () => {
  it('should convert an empty server schedule to client schedule', () => {
    expect(serverToClient(emptyServerSchedule)).toEqual(emptyClientSchedule);
  });

  it('should convert an empty client schedule to server schedule', () => {
    expect(clientToServer(emptyClientSchedule)).toEqual(emptyServerSchedule);
  });

  it('should convert an empty two-day server schedule to client schedule', () => {
    expect(clientToServer(empty2DayClientSchedule)).toEqual(empty2DayServerSchedule);
  });

  it('should convert an empty two-day client schedule to server schedule', () => {
    expect(serverToClient(empty2DayServerSchedule)).toEqual(empty2DayClientSchedule);
  });

  it('should convert a pair to strings', () => {
    expect(convertStartToString(undefined)).toEqual('');
    expect(convertEndToString(undefined)).toEqual('');
    expect(convertStartToString({ start: 0, end: 60 })).toEqual('00:00');
    expect(convertEndToString({ start: 0, end: 61 })).toEqual('01:01');
  });

  it('should convert a string time to number of minutes from midnight', () => {
    const string1 = '08:00';
    const string2 = '14:47';
    const num1 = 8 * 60;
    const num2 = 14 * 60 + 47;

    expect(convertToNumber(string1)).toBe(num1);
    expect(convertToNumber(string2)).toBe(num2);
  });

  it('should return undefined if trying to convert an empty string to a number', () => {
    const string1 = '';

    expect(convertToNumber(string1)).toBe(undefined);
  });

  it('should order schedules by effective date when converting to ServerSchedules', () => {
    expect(orderByEffDate(orderedMthroughS, fifthOfJuly2017)).toEqual(orderedByJuly5);
  });

  it('should order schedules by weekdays when converting to ClientSchedules', () => {
    expect(orderByWeekdays('2017-07-05', orderedByJuly5)).toEqual(orderedMthroughS);
  });

  it('should convert a complex server schedule', () => {
    expect(serverToClient(filledOutSS)).toEqual(filledOutCS);
    expect(serverToClient(complexSS)).toEqual(complexCS);
  });

  it('should convert a complex client schedule', () => {
    expect(clientToServer(filledOutCS)).toEqual(filledOutSS);
    expect(clientToServer(complexCS)).toEqual(complexSS);
  });

  it('should calculate if a string time comes before another string time', () => {
    const time1 = '00:00';
    const time2 = '00:01';
    const time3 = '08:00';

    expect(isStartBeforeEnd(time1, time2)).toBe(true);
    expect(isStartBeforeEnd(time2, time1)).toBe(false);
    expect(isStartBeforeEnd(time3, time1)).toBe(false);
    expect(isStartBeforeEnd(time2, time3)).toBe(true);
  });

  it('should reject DaySchedule a start time is after an end time', () => {
    expect(timesValid(daySchedule1)).toBe(true);
    expect(timesValid(daySchedule4)).toBe(false);
  });

  it('should reject DaySchedule if either start is the same as end', () => {
    expect(timesValid(daySchedule2)).toBe(false);
  });

  it('should reject DaySchedule if start2 is before end 1', () => {
    expect(timesValid(daySchedule3)).toBe(false);
  });

  it('should accept DaySchedule if there are no times', () => {
    expect(timesValid(daySchedule3)).toBe(false);
  });
});
