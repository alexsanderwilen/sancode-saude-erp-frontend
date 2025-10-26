import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PlanoStatus } from './plano-status.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoStatusService {

  private apiUrl = `${environment.apiUrl}/planos-status`;

  constructor(private http: HttpClient) { }

  getPlanosStatus(): Observable<PlanoStatus[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => Array.isArray(res) ? res as PlanoStatus[] : ((res?.content ?? []) as PlanoStatus[]))
    );
  }

  getPlanosStatusPaged(page: number, size: number, sort: string, order: string): Observable<Page<PlanoStatus>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<PlanoStatus>>(this.apiUrl, { params });
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

