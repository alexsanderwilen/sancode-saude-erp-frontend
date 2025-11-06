import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { Page } from '../../../shared/models/page.model';
import { ValidationExecution, ValidationResult, ValidationRule } from '../models/validation.model';

@Injectable({ providedIn: 'root' })
export class ValidationsService {
  private base = `${environment.apiUrl}/ans/validations`;
  constructor(private api: ApiService) {}

  run(disparo: string = 'MANUAL', escopo: string = 'GERAL', parametros?: Record<string, unknown>): Observable<{ id?: number }> {
    const body = parametros ?? {};
    return this.api.post<{ id?: number }>(`${this.base}/run`, body, { disparo, escopo });
  }

  executions(page: number, size: number): Observable<Page<ValidationExecution>> {
    return this.api.get<Page<ValidationExecution>>(`${this.base}/executions`, { page, size });
  }

  results(
    execucaoId: number | null,
    page: number,
    size: number,
    filters?: { severidade?: string; entidade?: string; de?: string; ate?: string; sort?: string; order?: 'asc'|'desc'; }
  ): Observable<Page<ValidationResult>> {
    const params: Record<string, string | number> = { page, size } as Record<string, string | number>;
    if (execucaoId != null) params['execucaoId'] = execucaoId;
    if (filters?.severidade) params['severidade'] = filters.severidade;
    if (filters?.entidade) params['entidade'] = filters.entidade;
    if (filters?.de) params['de'] = filters.de;
    if (filters?.ate) params['ate'] = filters.ate;
    if (filters?.sort) params['sort'] = `${filters.sort},${filters.order || 'asc'}`;
    return this.api.get<Page<ValidationResult>>(`${this.base}/results`, params);
  }

  rules(): Observable<ValidationRule[]> { return this.api.get<ValidationRule[]>(`${this.base}/rules`); }
}
