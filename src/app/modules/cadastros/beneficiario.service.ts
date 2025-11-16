import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Beneficiario, Page } from './beneficiario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/beneficiarios';

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getBeneficiarios(page: number, size: number, sort: string, order: string): Observable<Page<Beneficiario>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    const headers = new HttpHeaders({ 'x-no-global-loading': '1' });
    return this.http.get<Page<Beneficiario>>(this.apiUrl, { params, headers });
  }

  getById(id: string): Observable<Beneficiario> {
    return this.http.get<Beneficiario>(`${this.apiUrl}/${id}`);
  }

  create(model: Beneficiario): Observable<Beneficiario> {
    return this.http.post<Beneficiario>(this.apiUrl, model).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  update(id: string, model: Beneficiario): Observable<Beneficiario> {
    return this.http.put<Beneficiario>(`${this.apiUrl}/${id}`, model).pipe(
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
