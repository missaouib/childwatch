import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClientService {

  constructor(
    private http: Http
  ) {}

  public query(clientId?: string) {
    return this.http.get((clientId) ? '/api/client/' + clientId : '/api/client')
      .map(res => res.json());
  }


}
