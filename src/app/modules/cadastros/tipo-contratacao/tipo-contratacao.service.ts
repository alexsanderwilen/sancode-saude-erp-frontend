import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TipoContratacao } from './tipo-contratacao.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class TipoContratacaoService {

  private apiUrl = `${environment.apiUrl}/tipos-contratacao`;

  constructor(private http: HttpClient) { }

  getTiposContratacao(): Observable<TipoContratacao[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => Array.isArray(res) ? res as TipoContratacao[] : ((res?.content ?? []) as TipoContratacao[]))
    );
  }

  getTiposContratacaoPaged(page: number, size: number, sort: string, order: string): Observable<Page<TipoContratacao>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<TipoContratacao>>(this.apiUrl, { params });
  }

  create(payload: Partial<TipoContratacao>): Observable<TipoContratacao> {
    return this.http.post<TipoContratacao>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<TipoContratacao>): Observable<TipoContratacao> {
    return this.http.put<TipoContratacao>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

