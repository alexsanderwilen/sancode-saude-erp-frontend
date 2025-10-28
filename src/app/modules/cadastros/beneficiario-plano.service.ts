import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BeneficiarioPlano } from './beneficiario.model';

@Injectable({ providedIn: 'root' })
export class BeneficiarioPlanoService {
  private readonly http = inject(HttpClient);

  listByBeneficiario(beneficiarioId: string): Observable<BeneficiarioPlano[]> {
    return this.http.get<BeneficiarioPlano[]>(`${environment.apiUrl}/beneficiarios/${beneficiarioId}/planos`);
  }

  create(beneficiarioId: string, payload: BeneficiarioPlano): Observable<BeneficiarioPlano> {
    return this.http.post<BeneficiarioPlano>(`${environment.apiUrl}/beneficiarios/${beneficiarioId}/planos`, payload);
  }

  getById(id: number): Observable<BeneficiarioPlano> {
    return this.http.get<BeneficiarioPlano>(`${environment.apiUrl}/beneficiario-planos/${id}`);
  }

  update(id: number, payload: BeneficiarioPlano): Observable<BeneficiarioPlano> {
    return this.http.put<BeneficiarioPlano>(`${environment.apiUrl}/beneficiario-planos/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/beneficiario-planos/${id}`);
  }
}

