import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportsService {
  private base = `${environment.apiUrl}/ans/exports`;
  constructor(private http: HttpClient) {}

  create(tipo: string, parametros?: any): Observable<{ idExport: number }> {
    return this.http.post<{ idExport: number }>(`${this.base}/${tipo}`, parametros ? JSON.stringify(parametros) : '');
  }

  download(idExport: number): Observable<Blob> {
    return this.http.get(`${this.base}/${idExport}/download`, { responseType: 'blob' });
  }
}

