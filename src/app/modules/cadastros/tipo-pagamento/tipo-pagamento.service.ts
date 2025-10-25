import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TipoPagamento } from './tipo-pagamento.model';

@Injectable({ providedIn: 'root' })
export class TipoPagamentoService {
  private apiUrl = `${environment.apiUrl}/tipos-pagamento`;
  constructor(private http: HttpClient) {}
  getTiposPagamento(): Observable<TipoPagamento[]> {
    return this.http.get<TipoPagamento[]>(this.apiUrl);
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
