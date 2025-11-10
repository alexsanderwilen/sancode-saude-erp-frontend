import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TipoContratacao } from './tipo-contratacao.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TipoContratacaoService {
  private readonly endpoint = '/tipos-contratacao';

  constructor(private api: ApiService) { }

  getTiposContratacao(): Observable<TipoContratacao[]> {
    return this.api.get<any>(this.endpoint).pipe(
      map((res: any) => Array.isArray(res) ? res as TipoContratacao[] : ((res?.content ?? []) as TipoContratacao[]))
    );
  }

  getTiposContratacaoPaged(page: number, size: number, sort: string, order: string): Observable<Page<TipoContratacao>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<TipoContratacao>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  create(payload: Partial<TipoContratacao>): Observable<TipoContratacao> {
    return this.api.post<TipoContratacao>(this.endpoint, payload);
  }
  update(id: number, payload: Partial<TipoContratacao>): Observable<TipoContratacao> {
    return this.api.put<TipoContratacao>(`${this.endpoint}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}

