import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShowData, UnlockResponse } from '../models/show-data.model';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private readonly apiBaseUrl =
    environment.apiBaseUrl ??
    (environment.production ? '' : 'http://localhost:4000');

  constructor(private readonly http: HttpClient) {}

  getShowData(): Observable<ShowData> {
    return this.http.get<ShowData>(`${this.apiBaseUrl}/api/show`);
  }

  unlock(password: string): Observable<UnlockResponse> {
    return this.http.post<UnlockResponse>(`${this.apiBaseUrl}/api/unlock`, { password });
  }
}
