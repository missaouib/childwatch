import {
  calculateTimeEvents,
  calculateTimeline,
  slots,
  timelineRooms,
  timelineStateToSegmentType,
  transitionState
} from './timeline-calculations';

import {
  participant1,
  staff1,
  testRooms,
  staffTimeline,
  participantTimeline,
  timelineRoom,
  staffGridSlots,
  timelineGridSlots,
  scheduleList1,
  scheduleList2,
  presenceList1,
  presenceList2,
  graphTimeline1,
  graphTimeline2,
  expectedTimeSeries1,
  expectedTimeSeries2,
  NOW
} from '../../../sample-data/timeline-graph-data';

describe('the timeline graph calculation methods', () => {

  it('should convert a presence and a schedule into a single linear event series', () => {
    expect(calculateTimeEvents(scheduleList1, presenceList1, NOW))
      .toEqual(expectedTimeSeries1);
    expect(calculateTimeEvents(scheduleList2, presenceList2, NOW))
      .toEqual(expectedTimeSeries2);
  });

  it('should convert timeline states to segment types', () => {
    expect(timelineStateToSegmentType(false, false, false )).toEqual('I');
    expect(timelineStateToSegmentType(false, false, true )).toEqual('AN');
    expect(timelineStateToSegmentType(false, true, false )).toEqual('SNP');
    expect(timelineStateToSegmentType(false, true, true )).toEqual('ANS');
    expect(timelineStateToSegmentType(true, false, false )).toEqual('PNS');
    expect(timelineStateToSegmentType(true, false, true )).toEqual('AN');
    expect(timelineStateToSegmentType(true, true, false )).toEqual('AS');
    expect(timelineStateToSegmentType(true, true, true )).toEqual('ANS');
  });

  it('should transition between states based on new events', () => {
    expect(transitionState(false, false, false, { type: 'P', start: true, time: 2})).toEqual([true, false, false]);
    expect(transitionState(false, false, true, { type: 'S', start: true, time: 2})).toEqual([false, true, true]);
    expect(transitionState(false, true, false, { type: 'N', start: true, time: 2})).toEqual([false, true, true]);
    expect(transitionState(false, true, true, { type: 'P', start: false, time: 2})).toEqual([false, true, true]);
    expect(transitionState(true, false, false, { type: 'S', start: false, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, false, true, { type: 'N', start: false, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, true, false, { type: 'P', start: true, time: 2})).toEqual([true, true, false]);
    expect(transitionState(true, true, true, { type: 'S', start: true, time: 2})).toEqual([true, true, true]);
    expect(transitionState(false, false, false, { type: 'N', start: true, time: 2})).toEqual([false, false, true]);
    expect(transitionState(false, false, true, { type: 'P', start: false, time: 2})).toEqual([false, false, true]);
    expect(transitionState(false, true, false, { type: 'S', start: false, time: 2})).toEqual([false, false, false]);
    expect(transitionState(false, true, true, { type: 'N', start: false, time: 2})).toEqual([false, true, false]);
    expect(transitionState(true, false, false, { type: 'P', start: true, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, false, true, { type: 'S', start: true, time: 2})).toEqual([true, true, true]);
    expect(transitionState(true, true, false, { type: 'N', start: true, time: 2})).toEqual([true, true, true]);
    expect(transitionState(true, true, true, { type: 'P', start: false, time: 2})).toEqual([false, true, true]);
    expect(transitionState(false, false, false, { type: 'S', start: false, time: 2})).toEqual([false, false, false]);
    expect(transitionState(false, false, true, { type: 'N', start: false, time: 2})).toEqual([false, false, false]);
    expect(transitionState(false, true, false, { type: 'P', start: true, time: 2})).toEqual([true, true, false]);
    expect(transitionState(false, true, true, { type: 'S', start: true, time: 2})).toEqual([false, true, true]);
    expect(transitionState(true, false, false, { type: 'N', start: true, time: 2})).toEqual([true, false, true]);
    expect(transitionState(true, false, true, { type: 'P', start: false, time: 2})).toEqual([false, false, true]);
    expect(transitionState(true, true, false, { type: 'S', start: false, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, true, true, { type: 'N', start: false, time: 2})).toEqual([true, true, false]);
    expect(transitionState(false, false, false, { type: 'P', start: true, time: 2})).toEqual([true, false, false]);
    expect(transitionState(false, false, true, { type: 'S', start: true, time: 2})).toEqual([false, true, true]);
    expect(transitionState(false, true, false, { type: 'N', start: true, time: 2})).toEqual([false, true, true]);
    expect(transitionState(false, true, true, { type: 'P', start: false, time: 2})).toEqual([false, true, true]);
    expect(transitionState(true, false, false, { type: 'S', start: false, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, false, true, { type: 'N', start: false, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, true, false, { type: 'P', start: true, time: 2})).toEqual([true, true, false]);
    expect(transitionState(true, true, true, { type: 'S', start: true, time: 2})).toEqual([true, true, true]);
    expect(transitionState(false, false, false, { type: 'N', start: true, time: 2})).toEqual([false, false, true]);
    expect(transitionState(false, false, true, { type: 'P', start: false, time: 2})).toEqual([false, false, true]);
    expect(transitionState(false, true, false, { type: 'S', start: false, time: 2})).toEqual([false, false, false]);
    expect(transitionState(false, true, true, { type: 'N', start: false, time: 2})).toEqual([false, true, false]);
    expect(transitionState(true, false, false, { type: 'P', start: true, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, false, true, { type: 'S', start: true, time: 2})).toEqual([true, true, true]);
    expect(transitionState(true, true, false, { type: 'N', start: true, time: 2})).toEqual([true, true, true]);
    expect(transitionState(true, true, true, { type: 'P', start: false, time: 2})).toEqual([false, true, true]);
    expect(transitionState(false, false, false, { type: 'S', start: false, time: 2})).toEqual([false, false, false]);
    expect(transitionState(false, false, true, { type: 'N', start: false, time: 2})).toEqual([false, false, false]);
    expect(transitionState(false, true, false, { type: 'P', start: true, time: 2})).toEqual([true, true, false]);
    expect(transitionState(false, true, true, { type: 'S', start: true, time: 2})).toEqual([false, true, true]);
    expect(transitionState(true, false, false, { type: 'N', start: true, time: 2})).toEqual([true, false, true]);
    expect(transitionState(true, false, true, { type: 'P', start: false, time: 2})).toEqual([false, false, true]);
    expect(transitionState(true, true, false, { type: 'S', start: false, time: 2})).toEqual([true, false, false]);
    expect(transitionState(true, true, true, { type: 'N', start: false, time: 2})).toEqual([true, true, false]);
  });

  it('should calculate a single timeline from presence and schedule', () => {
    expect(calculateTimeline(scheduleList1, presenceList1, NOW))
      .toEqual(graphTimeline2);
    expect(calculateTimeline(scheduleList2, presenceList2, NOW))
      .toEqual(graphTimeline1);
  });

  it('should calculate the slots for a given room', () => {
    expect(slots([staff1], staffTimeline, testRooms[0].id, NOW))
      .toEqual(staffGridSlots);
    expect(slots([participant1], participantTimeline, testRooms[0].id, NOW))
      .toEqual(timelineGridSlots);
  });

  it('should provide room data ready for display', () => {
    expect(timelineRooms(
      testRooms, [staff1], [participant1], staffTimeline, participantTimeline, NOW
    )).toEqual([timelineRoom]);
  });
});
