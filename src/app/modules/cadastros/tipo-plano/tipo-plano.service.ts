import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TipoPlano } from './tipo-plano.model';
import { Page } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class TipoPlanoService {
  private apiUrl = `${environment.apiUrl}/tipos-plano`;
  constructor(private http: HttpClient) {}
  getTiposPlano(): Observable<TipoPlano[]> { return this.http.get<TipoPlano[]>(this.apiUrl); }

  getTiposPlanoPaged(page: number, size: number, sort: string, order: string): Observable<Page<TipoPlano>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      // Be resilient to backends that still return arrays
      // by wrapping into a Page-like shape
      (source) => new Observable<Page<TipoPlano>>(observer => {
        source.subscribe({
          next: (res: any) => {
            if (Array.isArray(res)) {
              observer.next({
                content: res as TipoPlano[],
                totalElements: res.length,
                number: 0,
                size: res.length
              } as unknown as Page<TipoPlano>);
            } else {
              observer.next(res as Page<TipoPlano>);
            }
            observer.complete();
          },
          error: err => observer.error(err)
        });
      })
    );
  }

  create(payload: Partial<TipoPlano>): Observable<TipoPlano> {
    return this.http.post<TipoPlano>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<TipoPlano>): Observable<TipoPlano> {
    return this.http.put<TipoPlano>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
