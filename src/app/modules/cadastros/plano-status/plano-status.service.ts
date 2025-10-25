import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoStatus } from './plano-status.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanoStatusService {

  private apiUrl = `${environment.apiUrl}/planos-status`;

  constructor(private http: HttpClient) { }

  getPlanosStatus(): Observable<PlanoStatus[]> {
    return this.http.get<PlanoStatus[]>(this.apiUrl);
  }

  create(payload: Partial<PlanoStatus>): Observable<PlanoStatus> {
    return this.http.post<PlanoStatus>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<PlanoStatus>): Observable<PlanoStatus> {
    return this.http.put<PlanoStatus>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
