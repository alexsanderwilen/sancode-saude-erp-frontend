import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Prestador } from './prestador.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {

  private readonly endpoint = '/prestadores';

  constructor(private api: ApiService) { }

  getPrestadores(): Observable<Prestador[]> {
    // fallback non-paginado
    return this.api.get<Prestador[]>(this.endpoint);
  }

  getPrestadoresPaged(page: number, size: number, sort: string, order: string): Observable<Page<Prestador>> {
    return this.api.get<any>(this.endpoint, { page, size, sort: `${sort},${order}` }).pipe(
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
    return this.api.get<Prestador>(`${this.endpoint}/${id}`);
  }

  createPrestador(prestador: Prestador): Observable<Prestador> {
    return this.api.post<Prestador>(this.endpoint, prestador);
  }

  updatePrestador(id: number, prestador: Prestador): Observable<Prestador> {
    return this.api.put<Prestador>(`${this.endpoint}/${id}`, prestador);
  }

  deletePrestador(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}

