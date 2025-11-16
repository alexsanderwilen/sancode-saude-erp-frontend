import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Operadora, Page } from './operadora.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/operadoras';

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getOperadoras(page: number, size: number, sort: string, order: string): Observable<Page<Operadora>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    const headers = new HttpHeaders({ 'x-no-global-loading': '1' });
    return this.http.get<Page<Operadora>>(this.apiUrl, { params, headers });
  }

  getById(id: string): Observable<Operadora> {
    return this.http.get<Operadora>(`${this.apiUrl}/${id}`);
  }

  create(operadora: Operadora): Observable<Operadora> {
    return this.http.post<Operadora>(this.apiUrl, operadora).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  update(id: string, operadora: Operadora): Observable<Operadora> {
    return this.http.put<Operadora>(`${this.apiUrl}/${id}`, operadora).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
}

