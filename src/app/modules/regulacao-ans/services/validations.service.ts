import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ValidationsService {
  private base = `${environment.apiUrl}/ans/validations`;
  constructor(private http: HttpClient) {}

  run(disparo: string = 'MANUAL', escopo: string = 'GERAL', parametros?: any): Observable<any> {
    return this.http.post(`${this.base}/run?disparo=${disparo}&escopo=${escopo}`, parametros ? JSON.stringify(parametros) : '');
  }

  executions(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.base}/executions`, { params });
  }

  results(execucaoId: number | null, page: number, size: number, filters?: { severidade?: string; entidade?: string; de?: string; ate?: string; sort?: string; order?: 'asc'|'desc'; }): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (execucaoId != null) params = params.set('execucaoId', execucaoId);
    if (filters?.severidade) params = params.set('severidade', filters.severidade);
    if (filters?.entidade) params = params.set('entidade', filters.entidade);
    if (filters?.de) params = params.set('de', filters.de);
    if (filters?.ate) params = params.set('ate', filters.ate);
    if (filters?.sort) params = params.set('sort', `${filters.sort},${filters.order || 'asc'}`);
    return this.http.get(`${this.base}/results`, { params });
  }

  rules(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/rules`); }
}
