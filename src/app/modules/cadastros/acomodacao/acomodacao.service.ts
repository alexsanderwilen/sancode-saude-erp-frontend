import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Acomodacao } from './acomodacao.model';

@Injectable({ providedIn: 'root' })
export class AcomodacaoService {
  private apiUrl = `${environment.apiUrl}/acomodacoes`;
  constructor(private http: HttpClient) {}
  getAcomodacoes(): Observable<Acomodacao[]> {
    return this.http.get<Acomodacao[]>(this.apiUrl);
  }
}

