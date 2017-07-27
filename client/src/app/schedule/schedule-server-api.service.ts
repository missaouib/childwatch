import { Injectable } from '@angular/core';
import { WatchQueryOptions } from 'apollo-client';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';

import { isoDate, timestamp, isoDateTime } from '../../common/date-utils';
import {
  StaticSchedulingData, Pair, ClientSchedule, DateType,
  PersonType, Assignment, PersonSchedule, ServerSchedule, DailyTimelinesByPerson
} from './interfaces';

const STATIC_DATA_POLLING_INTERVAL_MS = 60 * 1000;
const PERSON_SCHEDULE_POLLING_INTERVAL_MS = 5 * 60 * 1000;

@Injectable()
export class ScheduleServerApiService {

  constructor(private apollo: Apollo) { }

  // Obtains a schedule for an individual
  queryPersonSchedule(personId: string, effectiveOn: DateType): Observable<{ personSchedule: ServerSchedule }> {
    return this.apollo.watchQuery({
      ...personScheduleQuery(personId, effectiveOn),
      pollInterval: PERSON_SCHEDULE_POLLING_INTERVAL_MS
    })
      .map(result => result.data as {personSchedule: ServerSchedule});
  }

  // Gets the list of rooms, staff, and participants
  queryStaticData(): Observable<StaticSchedulingData> {
    const schedulingStatic = gql`
      query schedulingStatic {
        rooms {
          id
          name
          staffCapacity
          targetCapacity
          maxCapacity
        }
        staff {
          id
          firstName
          lastName
        }
        participants {
          id
          firstName
          lastName
          dateOfBirth
          imgUrl
        }
      }
    `;

    return this.apollo.watchQuery({
      query: schedulingStatic,
      pollInterval: STATIC_DATA_POLLING_INTERVAL_MS
    })
      .map(result => result.data as StaticSchedulingData);
  }

  // Obtains the information about who is located where and when
  queryTimelines(date: DateType, opts: Partial<WatchQueryOptions> = {}): Observable<DailyTimelinesByPerson> {
    return this.apollo.watchQuery({
      ...timelineQuery(date),
      ...opts
    })
      .map(result => result.data)
      .map(({ staffTimeline, participantTimeline }) => ({
        staffTimeline: transformTimeline(staffTimeline),
        participantTimeline: transformTimeline(participantTimeline)
      }));
  }

  // Sets the location of an individual
  // TODO update API interface to handle new assignment names
  updateIndividualAssignment(newAssignments: Assignment[], personSchedule: PersonSchedule) {
    let mutation: any;
    const variables: any = {
      date: isoDate(personSchedule.date),
      schedule: newAssignments.map(s => ({
        roomId: s.roomId,
        start: isoDateTime(s.start),
        end: isoDateTime(s.end)
      }))
    };
    if (personSchedule.type === PersonType.Participant) {
      mutation = gql`
      mutation updateParticipantSchedule($participantId: String!, $date: Date!, $schedule: [ScheduleInput]!) {
        updateParticipantSchedule(participantId: $participantId, date: $date, schedule: $schedule)
      }
      `;
      variables.participantId = personSchedule.who.id;
    } else {
      mutation = gql`
        mutation updateStaffSchedule($staffId: String!, $date: Date!, $schedule: [ScheduleInput]!) {
          updateStaffSchedule(staffId: $staffId, date: $date, schedule: $schedule)
        }
        `;
      variables.staffId = personSchedule.who.id;
    }
    return this.apollo.mutate({
      mutation,
      variables,
      refetchQueries: [timelineQuery(personSchedule.date)]
    });
  }

  // Sets the schedule of an invidual
  updatePersonSchedule(
    personSchedule: ClientSchedule,
    effectiveDate: number,
    variables: { effectiveDate: string, personId: string, schedule: Pair[][] }) {
    return this.apollo.mutate({
      mutation: gql`mutation updateSchedule($personId: String!, $effectiveDate: Date!, $schedule: [[ScheduleEntryInput]]!) {
        updateSchedule(personId: $personId, effectiveDate: $effectiveDate, schedule: $schedule)
      }`,
      variables,
      refetchQueries: [personScheduleQuery(personSchedule.personId, effectiveDate)]
    })
      .catch(err => { console.error(err); return Observable.of(); }); // TODO better error handling
  }
}

function timelineQuery(date: number | moment.Moment | Date) {
  const timeline = gql`
  query timeline($date: Date!) {
    staffTimeline(date: $date) {
      personId
      roomAssignments {
        roomId
        start
        end
      }
      presence {
        roomId
        start
        end
      }
    }
    participantTimeline(date: $date) {
      personId
      roomAssignments {
        roomId
        start
        end
      }
      presence {
        roomId
        start
        end
      }
    }
  }`;

  return {
    query: timeline,
    variables: { date: isoDate(date) }
  };
}

function personScheduleQuery(personId: string, effectiveOn: DateType) {
  return {
    query: gql`
      query personSchedule($personId: String!, $effectiveOn: Date!) {
        personSchedule(personId: $personId, effectiveOn: $effectiveOn) {
          personId
          effectiveDate
          schedule {
            start
            end
          }
        }
      }
    `,
    variables: {
      personId,
      effectiveOn: isoDate(effectiveOn)
    }
  };
};

// TODO: find out return type of server and remove the use of any
function transformTimeline(serverData: any) {
  return _(serverData)
    .map((personTimeline: any) => {
      return {
        ...personTimeline,
        roomAssignments: personTimeline.roomAssignments.map((s: any) => ({
          ...s,
          start: timestamp(s.start),
          end: timestamp(s.end)
        })),
        presence: personTimeline.presence.map((p: any) => ({
          ...p,
          start: timestamp(p.start),
          end: p.end && timestamp(p.end)
        }))
      };
    })
    .keyBy(pt => pt.personId)
    .value();
}
