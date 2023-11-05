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
    return this.client.get<Config>('http://localhost:3000/config');
  }

  updateConfig(config: Partial<Config>): Observable<void> {
    return this.client.post<void>('http://localhost:3000/config', config);
  }
}
