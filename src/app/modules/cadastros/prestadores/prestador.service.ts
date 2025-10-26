import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Prestador } from './prestador.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {

  private apiUrl = `${environment.apiUrl}/prestadores`;

  constructor(private http: HttpClient) { }

  getPrestadores(): Observable<Prestador[]> {
    // fallback non-paginado
    return this.http.get<Prestador[]>(this.apiUrl);
  }

  getPrestadoresPaged(page: number, size: number, sort: string, order: string): Observable<Page<Prestador>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      // Normaliza tanto resposta paginada (Page) quanto lista simples (array)
      // para que o ag-Grid receba totalElements corretamente.
      map((res: any) => {
        if (Array.isArray(res)) {
          const total = res.length;
          const start = page * size;
          const end = Math.min(start + size, total);
          const slice = res.slice(start, end) as Prestador[];
          const totalPages = size > 0 ? Math.ceil(total / size) : 1;
          return {
            content: slice,
            totalPages,
            totalElements: total,
            size,
            number: page,
            numberOfElements: slice.length,
            first: page === 0,
            last: end >= total,
            empty: total === 0
          } as Page<Prestador>;
        }
        return {
          content: (res.content || []) as Prestador[],
          totalPages: res.totalPages ?? 0,
          totalElements: res.totalElements ?? 0,
          size: res.size ?? size,
          number: res.number ?? page,
          numberOfElements: res.numberOfElements ?? ((res.content || []).length),
          first: res.first ?? (page === 0),
          last: res.last ?? false,
          empty: res.empty ?? ((res.content || []).length === 0)
        } as Page<Prestador>;
      })
    );
  }

  getPrestador(id: number): Observable<Prestador> {
    return this.http.get<Prestador>(`${this.apiUrl}/${id}`);
  }

  createPrestador(prestador: Prestador): Observable<Prestador> {
    return this.http.post<Prestador>(this.apiUrl, prestador);
  }

  updatePrestador(id: number, prestador: Prestador): Observable<Prestador> {
    return this.http.put<Prestador>(`${this.apiUrl}/${id}`, prestador);
  }

  deletePrestador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

