/**
 * @file: expands the definition of the router store
 * Also watches for router events and dispatches the appropriate actions to the store
 */

import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { routeChanged } from './router.state';

@Injectable()
export class RouterService {

  public name: string;

  constructor(router: Router, route: ActivatedRoute, store: Store<AppState>) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (route && route.firstChild) {
          /**
           * The "current route" is potentially multiple routes objects.
           * So instead of trying to capture "the current route" we store
           * the list of all active routes
           * 
           * Unfortunately,the snapshot is mutated by Angular and contains circular references
           * Thus we can't store it in the state
           * Instead copy the properties of value over
           * If more properties are needed add them here
           **/
          const routes = flat(route.snapshot.children);
          routes.unshift(route.snapshot);
          store.dispatch(routeChanged(routes.map(curRoute => curRoute.data)));
        }
      }
    });
  }

  is(name: string): boolean {
    return this.name === name;
  }
}

function flat(array: ActivatedRouteSnapshot[]) {
  let result: ActivatedRouteSnapshot[] = [];
  array.forEach(function (a) {
    result.push(a);
    if (Array.isArray(a.children)) {
      result = result.concat(flat(a.children));
    }
  });
  return result;
}
