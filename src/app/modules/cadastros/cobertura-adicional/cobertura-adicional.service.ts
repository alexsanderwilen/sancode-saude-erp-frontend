import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CoberturaAdicional } from './cobertura-adicional.model';

@Injectable({ providedIn: 'root' })
export class CoberturaAdicionalService {
  private apiUrl = `${environment.apiUrl}/coberturas-adicionais`;
  constructor(private http: HttpClient) {}
  getCoberturas(): Observable<CoberturaAdicional[]> {
    return this.http.get<CoberturaAdicional[]>(this.apiUrl);
  }
}

