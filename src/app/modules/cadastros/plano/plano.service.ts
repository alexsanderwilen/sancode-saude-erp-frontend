import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plano } from './plano.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  private apiUrl = `${environment.apiUrl}/planos`;
  private apiPlanoTipoPagamentoUrl = `${environment.apiUrl}/planos-tipos-pagamento`;
  private apiPlanoAcomodacaoUrl = `${environment.apiUrl}/planos-acomodacoes`;
  private apiPlanoCoberturaUrl = `${environment.apiUrl}/planos-coberturas-adicionais`;

  constructor(private http: HttpClient) { }

  getPlanos(): Observable<Plano[]> {
    return this.getPlanosPaged(0, 1000, 'nomeComercial', 'asc').pipe(map(r => r.content));
  }

  getPlanosPaged(page: number, size: number, sort: string, order: string): Observable<Page<Plano>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<Plano>>(this.apiUrl, { params });
  }

  getPlano(id: number): Observable<Plano> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(dto => ({
        id: dto.id,
        nomeComercial: dto.nomeComercial,
        registroAns: dto.registroAns,
        possuiCoparticipacao: dto.possuiCoparticipacao,
        percentualCoparticipacao: dto.percentualCoparticipacao,
        franquiaValor: dto.franquiaValor,
        valorMensalidade: dto.valorMensalidade,
        dataInicioVigencia: dto.dataInicioVigencia,
        dataFimVigencia: dto.dataFimVigencia,
        ativo: dto.ativo,
        idPlanoBase: dto.planoBase?.id,
        idSegmentacao: dto.segmentacao?.id,
        idAbrangencia: dto.abrangencia?.id,
        idTipoContratacao: dto.tipoContratacao?.id,
        idPlanoStatus: dto.status?.id
      }) as Plano)
    );
  }

  createPlano(plano: Plano): Observable<Plano> {
    const dto = this.mapToBackendDto(plano);
    return this.http.post<Plano>(this.apiUrl, dto);
  }

  updatePlano(id: number, plano: Plano): Observable<Plano> {
    const dto = this.mapToBackendDto(plano);
    return this.http.put<Plano>(`${this.apiUrl}/${id}`, dto);
  }

  deletePlano(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // N:N helpers
  getTiposPagamentoByPlano(planoId: number): Observable<number[]> {
    return this.http.get<any[]>(`${this.apiPlanoTipoPagamentoUrl}/plano/${planoId}`).pipe(
      map(items => items.map(i => i.tipoPagamento.id))
    );
  }

  replaceTiposPagamento(planoId: number, tipoIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiPlanoTipoPagamentoUrl}/plano/${planoId}`, tipoIds);
  }

  getAcomodacoesByPlano(planoId: number): Observable<number[]> {
    return this.http.get<any[]>(`${this.apiPlanoAcomodacaoUrl}/plano/${planoId}`).pipe(
      map(items => items.map(i => i.acomodacao.id))
    );
  }

  replaceAcomodacoes(planoId: number, acomodacaoIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiPlanoAcomodacaoUrl}/plano/${planoId}`, acomodacaoIds);
  }

  getCoberturasByPlano(planoId: number): Observable<number[]> {
    return this.http.get<any[]>(`${this.apiPlanoCoberturaUrl}/plano/${planoId}`).pipe(
      map(items => items.map(i => i.coberturaAdicional.id))
    );
  }

  replaceCoberturas(planoId: number, coberturaIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiPlanoCoberturaUrl}/plano/${planoId}`, coberturaIds);
  }

  private mapToBackendDto(plano: Plano): any {
    const dto: any = {
      id: plano.id,
      nomeComercial: plano.nomeComercial,
      registroAns: plano.registroAns,
      possuiCoparticipacao: plano.possuiCoparticipacao,
      percentualCoparticipacao: plano.percentualCoparticipacao,
      franquiaValor: plano.franquiaValor,
      valorMensalidade: plano.valorMensalidade,
      dataInicioVigencia: plano.dataInicioVigencia,
      dataFimVigencia: plano.dataFimVigencia,
      ativo: plano.ativo,
      planoBase: plano.idPlanoBase ? { id: plano.idPlanoBase } : null,
      segmentacao: plano.idSegmentacao ? { id: plano.idSegmentacao } : null,
      abrangencia: plano.idAbrangencia ? { id: plano.idAbrangencia } : null,
      tipoContratacao: plano.idTipoContratacao ? { id: plano.idTipoContratacao } : null,
      status: plano.idPlanoStatus ? { id: plano.idPlanoStatus } : null
    };

    // Aninhar relacionamentos como em Operadora
    if (plano.tiposPagamentoIds && plano.tiposPagamentoIds.length) {
      dto.tiposPagamento = plano.tiposPagamentoIds.map(id => ({ tipoPagamento: { id } }));
    }
    if (plano.acomodacoesIds && plano.acomodacoesIds.length) {
      dto.acomodacoes = plano.acomodacoesIds.map(id => ({ acomodacao: { id } }));
    }
    if (plano.coberturasAdicionaisIds && plano.coberturasAdicionaisIds.length) {
      dto.coberturasAdicionais = plano.coberturasAdicionaisIds.map(id => ({ coberturaAdicional: { id }, inclusa: true }));
    }

    return dto;
  }

  // N:N item-wise operations for AgGrid tabs
  listPlanoTiposPagamento(planoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPlanoTipoPagamentoUrl}/plano/${planoId}`);
  }
  addPlanoTipoPagamento(planoId: number, tipoPagamentoId: number): Observable<any> {
    return this.http.post<any>(this.apiPlanoTipoPagamentoUrl, {
      planoId,
      tipoPagamento: { id: tipoPagamentoId }
    });
  }
  deletePlanoTipoPagamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPlanoTipoPagamentoUrl}/${id}`);
  }

  listPlanoAcomodacoes(planoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPlanoAcomodacaoUrl}/plano/${planoId}`);
  }
  addPlanoAcomodacao(planoId: number, acomodacaoId: number): Observable<any> {
    return this.http.post<any>(this.apiPlanoAcomodacaoUrl, {
      planoId,
      acomodacao: { id: acomodacaoId }
    });
    }
  deletePlanoAcomodacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPlanoAcomodacaoUrl}/${id}`);
  }

  listPlanoCoberturas(planoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPlanoCoberturaUrl}/plano/${planoId}`);
  }
  addPlanoCobertura(planoId: number, coberturaId: number, inclusa: boolean, observacao?: string): Observable<any> {
    return this.http.post<any>(this.apiPlanoCoberturaUrl, {
      planoId,
      coberturaAdicional: { id: coberturaId },
      inclusa,
      observacao
    });
  }
  updatePlanoCobertura(id: number, payload: { coberturaId: number, inclusa: boolean, observacao?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiPlanoCoberturaUrl}/${id}`, {
      id,
      coberturaAdicional: { id: payload.coberturaId },
      inclusa: payload.inclusa,
      observacao: payload.observacao
    });
  }
  deletePlanoCobertura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiPlanoCoberturaUrl}/${id}`);
  }
}

