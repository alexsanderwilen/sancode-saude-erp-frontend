import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TipoPagamento } from './tipo-pagamento.model';
import { Page } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class TipoPagamentoService {
  private apiUrl = `${environment.apiUrl}/tipos-pagamento`;
  constructor(private http: HttpClient) {}
  getTiposPagamento(): Observable<TipoPagamento[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => Array.isArray(res) ? res as TipoPagamento[] : ((res?.content ?? []) as TipoPagamento[]))
    );
  }

  getTiposPagamentoPaged(page: number, size: number, sort: string, order: string): Observable<Page<TipoPagamento>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<TipoPagamento>>(this.apiUrl, { params });
  }

  create(payload: Partial<TipoPagamento>): Observable<TipoPagamento> {
    return this.http.post<TipoPagamento>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<TipoPagamento>): Observable<TipoPagamento> {
    return this.http.put<TipoPagamento>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
