import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EstadoCivil, Sexo } from './beneficiario.model';

@Injectable({ providedIn: 'root' })
export class SexoEstadoService {
  private readonly http = inject(HttpClient);

  getSexos(): Observable<Sexo[]> {
    return this.http.get<Sexo[]>(environment.apiUrl + '/sexo');
    }

  getEstadosCivis(): Observable<EstadoCivil[]> {
    return this.http.get<EstadoCivil[]>(environment.apiUrl + '/estado-civil');
  }
}
