import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Config} from "@chabb/shared";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private readonly client: HttpClient) { }

  fetchConfig(): Observable<Config> {
    return this.client.get<Config>('/config');
  }

  updateConfig(config: Partial<Config>): Observable<void> {
    return this.client.post<void>('/config', config);
  }
}
