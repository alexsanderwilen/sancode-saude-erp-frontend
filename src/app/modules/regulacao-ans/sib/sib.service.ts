import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SibMovimentacao } from './sib-movimentacao.model';

@Injectable({
  providedIn: 'root'
})
export class SibService {

  private http = inject(HttpClient);
  private apiUrl = '/api/sib';

  /**
   * Busca as movimentações pendentes do SIB na API.
   * @param params - Filtros opcionais de data.
   */
  getMovimentacoesPendentes(params?: { dataInicio?: string; dataFim?: string }): Observable<SibMovimentacao[]> {
    let httpParams = new HttpParams();
    if (params?.dataInicio) {
      httpParams = httpParams.set('dataInicio', params.dataInicio);
    }
    if (params?.dataFim) {
      httpParams = httpParams.set('dataFim', params.dataFim);
    }
    return this.http.get<SibMovimentacao[]>(`${this.apiUrl}/movimentacoes-pendentes`, { params: httpParams });
  }

  /**
   * Envia a lista de movimentações selecionadas para a API e solicita a geração do arquivo SIB.
   * @param movimentacoes - A lista de movimentações a serem incluídas no arquivo.
   */
  gerarArquivoSib(movimentacoes: SibMovimentacao[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/gerar-arquivo`, movimentacoes, {
      responseType: 'blob' // Importante para receber o arquivo como um Blob
    });
  }
}
