import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TipoPagamento } from './tipo-pagamento.model';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class TipoPagamentoService {
  private readonly endpoint = `${environment.apiUrl}/tipos-pagamento`;
  constructor(private api: ApiService) {}
  getTiposPagamento(): Observable<TipoPagamento[]> {
    return this.api.get<any>(this.endpoint).pipe(
      map((res: any) => Array.isArray(res) ? res as TipoPagamento[] : ((res?.content ?? []) as TipoPagamento[]))
    );
  }

  getTiposPagamentoPaged(page: number, size: number, sort: string, order: string): Observable<Page<TipoPagamento>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<TipoPagamento>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  create(payload: Partial<TipoPagamento>): Observable<TipoPagamento> {
    return this.api.post<TipoPagamento>(this.endpoint, payload);
  }
  update(id: number, payload: Partial<TipoPagamento>): Observable<TipoPagamento> {
    return this.api.put<TipoPagamento>(`${this.endpoint}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}

