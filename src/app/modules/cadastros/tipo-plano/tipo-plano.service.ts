import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TipoPlano } from './tipo-plano.model';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class TipoPlanoService {
  private readonly endpoint = `${environment.apiUrl}/tipos-plano`;
  constructor(private api: ApiService) {}

  getTiposPlano(): Observable<TipoPlano[]> {
    return this.api.get<TipoPlano[]>(this.endpoint);
  }

  getTiposPlanoPaged(page: number, size: number, sort: string, order: string): Observable<Page<TipoPlano>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<TipoPlano>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  create(payload: Partial<TipoPlano>): Observable<TipoPlano> {
    return this.api.post<TipoPlano>(this.endpoint, payload);
  }

  update(id: number, payload: Partial<TipoPlano>): Observable<TipoPlano> {
    return this.api.put<TipoPlano>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
