import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Acomodacao } from './acomodacao.model';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class AcomodacaoService {
  private readonly endpoint = `${environment.apiUrl}/acomodacoes`;
  constructor(private api: ApiService) {}
  getAcomodacoes(): Observable<Acomodacao[]> {
    return this.api.get<any>(this.endpoint).pipe(
      map((res: any) => Array.isArray(res) ? res as Acomodacao[] : ((res?.content ?? []) as Acomodacao[]))
    );
  }

  getAcomodacoesPaged(page: number, size: number, sort: string, order: string): Observable<Page<Acomodacao>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<Acomodacao>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  create(payload: Partial<Acomodacao>): Observable<Acomodacao> {
    return this.api.post<Acomodacao>(this.endpoint, payload);
  }
  update(id: number, payload: Partial<Acomodacao>): Observable<Acomodacao> {
    return this.api.put<Acomodacao>(`${this.endpoint}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}

