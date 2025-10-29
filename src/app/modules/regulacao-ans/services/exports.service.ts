import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportsService {
  private base = `${environment.apiUrl}/ans/exports`;
  constructor(private http: HttpClient) {}

  create(tipo: string, parametros?: any): Observable<{ idExport: number }> {
    const body = parametros ?? {};
    return this.http.post<{ idExport: number }>(`${this.base}/${tipo}`, body);
  }

  download(idExport: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.base}/${idExport}/download`, { responseType: 'blob', observe: 'response' });
  }

  list(page: number, size: number): Observable<any> {
    const params = { page, size } as any;
    return this.http.get(`${this.base}`, { params });
  }

  get(id: number): Observable<any> { return this.http.get(`${this.base}/${id}`); }
}
