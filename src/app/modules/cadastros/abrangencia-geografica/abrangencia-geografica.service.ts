import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AbrangenciaGeografica } from './abrangencia-geografica.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class AbrangenciaGeograficaService {

  private apiUrl = `${environment.apiUrl}/abrangencias-geograficas`;

  constructor(private http: HttpClient) { }

  getAbrangencias(): Observable<AbrangenciaGeografica[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Suporta tanto array quanto Page
      map((res: any) => Array.isArray(res) ? res : (res?.content ?? []))
    );
  }

  getAbrangenciasPaged(page: number, size: number, sort: string, order: string): Observable<Page<AbrangenciaGeografica>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<AbrangenciaGeografica>>(this.apiUrl, { params });
  }

  create(payload: Partial<AbrangenciaGeografica>): Observable<AbrangenciaGeografica> {
    return this.http.post<AbrangenciaGeografica>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<AbrangenciaGeografica>): Observable<AbrangenciaGeografica> {
    return this.http.put<AbrangenciaGeografica>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
