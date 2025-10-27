import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Acomodacao } from './acomodacao.model';
import { Page } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class AcomodacaoService {
  private apiUrl = `${environment.apiUrl}/acomodacoes`;
  constructor(private http: HttpClient) {}
  getAcomodacoes(): Observable<Acomodacao[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => Array.isArray(res) ? res as Acomodacao[] : ((res?.content ?? []) as Acomodacao[]))
    );
  }

  getAcomodacoesPaged(page: number, size: number, sort: string, order: string): Observable<Page<Acomodacao>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<Acomodacao>>(this.apiUrl, { params });
  }

  create(payload: Partial<Acomodacao>): Observable<Acomodacao> {
    return this.http.post<Acomodacao>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<Acomodacao>): Observable<Acomodacao> {
    return this.http.put<Acomodacao>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

