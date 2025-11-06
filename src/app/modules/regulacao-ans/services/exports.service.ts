import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ExportsService {
  private base = `${environment.apiUrl}/ans/exports`;
  constructor(private http: HttpClient, private api: ApiService) {}

  create(tipo: string, parametros?: Record<string, string | number>): Observable<{ idExport: number }> {
    const body = parametros ?? {};
    return this.api.post<{ idExport: number }>(`${this.base}/${tipo}`, body);
  }

  download(idExport: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.base}/${idExport}/download`, { responseType: 'blob', observe: 'response' });
  }

  list(page: number, size: number): Observable<any> {
    return this.api.get<any>(`${this.base}`, { page, size });
  }

  get(id: number): Observable<any> { return this.api.get<any>(`${this.base}/${id}`); }
}
