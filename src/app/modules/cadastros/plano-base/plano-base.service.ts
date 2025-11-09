import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlanoBase } from './plano-base.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class PlanoBaseService {
  private apiUrl = `${environment.apiUrl}/planos-base`;
  constructor(private http: HttpClient) { }

  getPlanosBase(): Observable<PlanoBase[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => (Array.isArray(res) ? res : (res?.content ?? [])).map((item: any) => ({
        ...item,
        descricao: item?.operadora?.razaoSocial || item?.operadora?.nomeFantasia || `#${item?.id}`
      })))
    );
  }

  getPlanosBasePaged(page: number, size: number, sort: string, order: string): Observable<Page<PlanoBase>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    const headers = new HttpHeaders({ 'x-no-global-loading': '1' });
    return this.http.get<Page<PlanoBase>>(this.apiUrl, { params, headers });
  }

  create(payload: Partial<PlanoBase>): Observable<PlanoBase> {
    return this.http.post<PlanoBase>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<PlanoBase>): Observable<PlanoBase> {
    return this.http.put<PlanoBase>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
