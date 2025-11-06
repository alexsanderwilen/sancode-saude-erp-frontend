import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AbrangenciaGeografica } from './abrangencia-geografica.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AbrangenciaGeograficaService {

  private readonly endpoint = `${environment.apiUrl}/abrangencias-geograficas`;

  constructor(private api: ApiService) { }

  getAbrangencias(): Observable<AbrangenciaGeografica[]> {
    return this.api.get<any>(this.endpoint).pipe(
      // Suporta tanto array quanto Page
      map((res: any) => Array.isArray(res) ? res : (res?.content ?? []))
    );
  }

  getAbrangenciasPaged(page: number, size: number, sort: string, order: string): Observable<Page<AbrangenciaGeografica>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<AbrangenciaGeografica>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  create(payload: Partial<AbrangenciaGeografica>): Observable<AbrangenciaGeografica> {
    return this.api.post<AbrangenciaGeografica>(this.endpoint, payload);
  }

  update(id: number, payload: Partial<AbrangenciaGeografica>): Observable<AbrangenciaGeografica> {
    return this.api.put<AbrangenciaGeografica>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}

