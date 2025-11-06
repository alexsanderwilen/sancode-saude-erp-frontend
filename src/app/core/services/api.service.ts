import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    const httpParams = this.toHttpParams(params);
    return this.http.get<T>(this.url(endpoint), { params: httpParams });
  }

  post<T>(endpoint: string, body: unknown, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    const httpParams = this.toHttpParams(params);
    return this.http.post<T>(this.url(endpoint), body, { params: httpParams });
  }

  put<T>(endpoint: string, body: unknown, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    const httpParams = this.toHttpParams(params);
    return this.http.put<T>(this.url(endpoint), body, { params: httpParams });
  }

  delete<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    const httpParams = this.toHttpParams(params);
    return this.http.delete<T>(this.url(endpoint), { params: httpParams });
  }

  page<T>(endpoint: string, options: { page?: number; size?: number; sort?: string; order?: 'asc' | 'desc' } = {}): Observable<Page<T>> {
    const { page, size, sort, order } = options;
    const params: Record<string, string> = {};
    if (typeof page === 'number') params['page'] = String(page);
    if (typeof size === 'number') params['size'] = String(size);
    if (sort) params['sort'] = order ? `${sort},${order}` : sort;

    return this.http.get<unknown>(this.url(endpoint), { params: this.toHttpParams(params) }).pipe(
      map((res: unknown) => {
        if (Array.isArray(res)) {
          const content = res as T[];
          return {
            content,
            totalPages: 1,
            totalElements: content.length,
            size: content.length,
            number: 0,
            numberOfElements: content.length,
            first: true,
            last: true,
            empty: content.length === 0
          } as Page<T>;
        }
        return res as Page<T>;
      })
    );
  }

  private url(endpoint: string): string {
    if (!endpoint) return this.baseUrl;
    return endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;
  }

  private toHttpParams(params?: Record<string, string | number | boolean | undefined>): HttpParams | undefined {
    if (!params) return undefined;
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
    });
    return httpParams;
  }
}

