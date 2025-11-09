import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';
import { PlanoBaseService } from '../plano-base.service';
import { OperadoraService } from '../../operadora.service';
import { PlanoBaseFormComponent } from '../plano-base-form/plano-base-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plano-base-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatButtonModule, MatDialogModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './plano-base-list.component.html',
  styleUrls: ['./plano-base-list.component.scss']
})
export class PlanoBaseListComponent {
  datasource!: IDatasource;
  private gridApi?: GridApi;

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', width: 120, sortable: true, filter: true },
    { headerName: 'Tipo de Plano', valueGetter: (p: any) => p.data?.tipoPlano?.descricao || '-', width: 200, sortable: true, filter: true },
    { headerName: 'Operadora', valueGetter: (p: any) => p.data?.operadora?.razaoSocial || p.data?.operadora?.nomeFantasia || '-', width: 260, sortable: true, filter: true },
    { headerName: 'Código ANS', field: 'codigoProdutoAns', width: 160, sortable: true },
    { headerName: 'Nome do Produto', field: 'nomeProduto', flex: 1, sortable: true, filter: true },
    { headerName: 'Abrangência', valueGetter: (p: any) => p.data?.abrangencia?.descricao || '-', width: 180, sortable: true, filter: true },
    { headerName: 'Tipo Contratação', valueGetter: (p: any) => p.data?.tipoContratacao?.descricao || '-', width: 200, sortable: true, filter: true },
    { headerName: 'Ativo', field: 'ativo', width: 120, cellRenderer: (p: { value: boolean }) => (
      p.value ? '<span class="badge text-bg-success">Ativo</span>' : '<span class="badge text-bg-danger">Inativo</span>'
    ) },
    {
      headerName: 'Ações', width: 180,
      cellRenderer: () => `
        <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
        <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
      `,
      onCellClicked: (p: any) => {
        const action = (p.event?.target as HTMLElement)?.getAttribute('data-action');
        if (action === 'edit') this.openDialog(p.data);
        if (action === 'delete') this.remove(p.data);
      }
    }
  ];

  private apiUrl = `${environment.apiUrl}/planos-base`;
  gridOptions: GridOptions;
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private operadoraService: OperadoraService,
    private agGridLocaleService: AgGridLocaleService,
    private planoBaseService: PlanoBaseService,
    private route: ActivatedRoute
  ) {
    this.datasource = this.createDatasource();
    this.gridOptions = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      theme: 'legacy',
      rowModelType: 'infinite',
      pagination: true,
      paginationPageSize: 20,
      cacheBlockSize: 20,
      defaultColDef: { sortable: true }
    };
  }

  onGridReady(params: GridReadyEvent): void { this.gridApi = params.api; }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(q => {
      const editId = q.get('editId');
      if (editId) {
        this.planoBaseService.getPlanosBasePaged(0, 1, 'id', 'asc').subscribe(() => {
          // fetch single by API if exists (reusing service update/get not available); use generic GET
          this.http.get<any>(`${this.apiUrl}/${editId}`).subscribe(row => this.openDialog(row));
        });
      }
    });
  }
  createDatasource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => {
        const pageSize = this.gridOptions.paginationPageSize || 20;
        const page = params.startRow / pageSize;
        const sortModel = params.sortModel;
        const sort = sortModel.length ? sortModel[0].colId : 'nomeProduto';
        const order = sortModel.length ? (sortModel[0].sort || 'asc') : 'asc';
        this.planoBaseService.getPlanosBasePaged(page, pageSize, sort, order).subscribe({
          next: data => params.successCallback(data.content, data.totalElements),
          error: () => params.failCallback()
        });
      }
    };
  }
  openDialog(row?: any): void {
    const form: FormGroup = this.fb.group({
      id: [row?.id || null],
      tipoPlanoId: [row?.tipoPlano?.id || null, Validators.required],
      operadoraId: [row?.operadora?.idOperadora || null, Validators.required],
      codigoProdutoAns: [row?.codigoProdutoAns || '', Validators.required],
      nomeProduto: [row?.nomeProduto || '', Validators.required],
      abrangenciaId: [row?.abrangencia?.id || null, Validators.required],
      tipoContratacaoId: [row?.tipoContratacao?.id || null, Validators.required],
      descricao: [row?.descricao || ''],
      dataRegistroAns: [row?.dataRegistroAns ? new Date(row.dataRegistroAns) : null],
      permiteComercializacao: [row?.permiteComercializacao ?? true],
      ativo: [row?.ativo ?? true]
    });

    const operadoras$ = this.operadoraService.getOperadoras(0, 1000, 'razaoSocial', 'asc').pipe(map(p => p.content));
    const tiposPlano$ = this.http.get<any[]>(`${this.apiUrl.replace('planos-base','tipos-plano')}`);
    const abrangencias$ = this.http.get<any>(`${environment.apiUrl}/abrangencias-geograficas`, { params: new HttpParams().set('page','0').set('size','1000') }).pipe(map((p: any) => p.content));
    const tiposContratacao$ = this.http.get<any>(`${environment.apiUrl}/tipos-contratacao`, { params: new HttpParams().set('page','0').set('size','1000') }).pipe(map((p: any) => p.content));
    const ref = this.dialog.open(PlanoBaseFormComponent, { width: '900px', data: { form, title: row ? 'Editar' : 'Novo', operadoras$, tiposPlano$, abrangencias$, tiposContratacao$ }, disableClose: true });
    ref.afterClosed().subscribe(res => {
      if (res?.saved) {
        const payload: any = {
          id: form.value.id,
          tipoPlano: form.value.tipoPlanoId ? { id: form.value.tipoPlanoId } : null,
          operadora: form.value.operadoraId ? { idOperadora: form.value.operadoraId } : null,
          abrangencia: form.value.abrangenciaId ? { id: form.value.abrangenciaId } : null,
          tipoContratacao: form.value.tipoContratacaoId ? { id: form.value.tipoContratacaoId } : null,
          codigoProdutoAns: form.value.codigoProdutoAns,
          nomeProduto: form.value.nomeProduto,
          descricao: form.value.descricao,
          dataRegistroAns: form.value.dataRegistroAns ? (new Date(form.value.dataRegistroAns)).toISOString().substring(0,10) : null,
          permiteComercializacao: form.value.permiteComercializacao,
          ativo: form.value.ativo
        };
        const obs = payload.id ? this.planoBaseService.update(payload.id, payload) : this.planoBaseService.create(payload);
        obs.subscribe(() => this.gridApi?.refreshInfiniteCache());
      }
    });
  }
  remove(row: any): void { this.planoBaseService.delete(row.id).subscribe(() => this.gridApi?.refreshInfiniteCache()); }
}
