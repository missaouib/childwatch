// import { WatchQueryOptions } from 'apollo-client';
// import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import gql from 'graphql-tag';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
//import * as _ from 'lodash';

import { DateType } from '../interfaces';
// Consider using Lerna for multiple subprojects within just the client so that the following
// line can look like:
// import { AppState } from '@remarkable/app.state'
// much more resiliant in the face of refactoring and easier to maintain
import { AppState } from '../../../app/app.state';
import {
  WATCH_STATIC_DATA, staticDataReceived, watchStaticData,
  loadTimelines, StaticSchedulingData, DailyTimelinesByPerson
} from '../scheduling.state';
import { isoDate } from '../../../common/date-utils';

// TODO: Move these to a plain TS file?
//const STATIC_DATA_POLLING_INTERVAL_MS = 60 * 1000;
//const TIMELINE_DATA_POLLING_INTERVAL_MS = 200 * 1000;
const RETRY_DELAY_MS = 10 * 1000;

// TODO: Move these to a plain TS file?
//const schedulingStatic = gql`
//  query schedulingStatic {
//    rooms {
//      id
//      name
//      staffCapacity
//      targetCapacity
//      maxCapacity
//    }
//    staff {
//      id
//      firstName
//      lastName
//    }
//    participants {
//      id
//      firstName
//      lastName
//      dateOfBirth
//      imgUrl
//    }
//  }
//`;
//
//const timeline = gql`
//  query timeline($date: Date!) {
//    staffTimeline(date: $date) {
//      personId
//      schedule {
//        roomId
//        start
//        end
//      }
//      presence {
//        roomId
//        start
//        end
//      }
//    }
//    participantTimeline(date: $date) {
//      personId
//      schedule {
//        roomId
//        start
//        end
//      }
//      presence {
//        roomId
//        start
//        end
//      }
//    }
//  }
//`;

// TODO: Move these to a plain TS file?
export function timelineQuery(date: number | moment.Moment | Date) {
  return {
    query: <any>undefined, //timeline,
    variables: { date: isoDate(date) }
  };
}

@Injectable()
export class SchedulingQueryService {
  // TODO error handling etc
  // TODO: this should not be an effect unless the trigger
  // can be something other than the initialization of this service
  // If this only occurs because of the service initilization it should
  // should just be a fetch in dispatch in the initilization.
  @Effect()
  watchQueries$ = this.actions$.ofType(WATCH_STATIC_DATA)
    .switchMap(() =>
      this.queryStaticData()
        .map(staticDataReceived)
        .catch(() => Observable.of(watchStaticData()).delay(RETRY_DELAY_MS)));

//  @Effect()
//  laodTimelines$ = this.actions$.ofType(LOAD_TIMELINES)
//    .map(toPayload)
//    .switchMap(date =>
//      this.queryTimelines(date, { pollInterval: TIMELINE_DATA_POLLING_INTERVAL_MS })
//        .map(timelines => timelineDataReceived(date, timelines))
//        .catch(() => Observable.of(loadTimelines(date)).delay(RETRY_DELAY_MS))
//    );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
  ) {
  }

  // TODO: see comment on watchQueries$
  initialize() {
    this.store.dispatch(watchStaticData());
  }

  loadTimelines(date: DateType) {
    this.store.dispatch(loadTimelines(date));
  }

  queryStaticData(): Observable<StaticSchedulingData> {
    return undefined; //this.apollo.watchQuery({
//      query: schedulingStatic,
//      pollInterval: STATIC_DATA_POLLING_INTERVAL_MS
//    })
//      .map(result => result.data);
  }

  queryTimelines() : Observable<DailyTimelinesByPerson> { // date: DateType, opts: Partial<WatchQueryOptions> = {}): Observable<DailyTimelinesByPerson> {
    
  return undefined;
//    return this.apollo.watchQuery({
//      ...timelineQuery(date),
//      ...opts
//    })
//      .map(result => result.data)
//      .map(({ staffTimeline, participantTimeline }) => ({
//        staffTimeline: transformTimeline(staffTimeline),
//        participantTimeline: transformTimeline(participantTimeline)
//      }));
  }
}

// TODO: find out return type of server and remove the use of any
//function transformTimeline(serverData: any) {
//  return _(serverData)
//    .map((personTimeline: any) => {
//      return {
//        ...personTimeline,
//        schedule: personTimeline.schedule.map((s: any) => ({
//          ...s,
//          start: timestamp(s.start),
//          end: timestamp(s.end)
//        })),
//        presence: personTimeline.presence.map((p: any) => ({
//          ...p,
//          start: timestamp(p.start),
//          end: p.end && timestamp(p.end)
//        }))
//      };
//    })
//    .keyBy(pt => pt.personId)
//    .value();
//}
