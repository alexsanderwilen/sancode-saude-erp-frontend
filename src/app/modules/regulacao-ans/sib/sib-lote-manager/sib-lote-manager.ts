import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// ag-Grid
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

// App specific
import { SibService } from '../sib.service';
import { SibMovimentacao } from '../sib-movimentacao.model';

@Component({
  selector: 'app-sib-lote-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AgGridModule
  ],
  templateUrl: './sib-lote-manager.html',
  styleUrls: ['./sib-lote-manager.scss']
})
export class SibLoteManagerComponent implements OnInit {

  private sibService = inject(SibService);
  private fb = inject(FormBuilder);

  private gridApi!: GridApi<SibMovimentacao>;

  filterForm!: FormGroup;
  isLoading = false;
  rowData: SibMovimentacao[] = [];

  columnDefs: ColDef<SibMovimentacao>[] = [
    { headerName: 'Beneficiário', field: 'nomeBeneficiario', checkboxSelection: true, headerCheckboxSelection: true, flex: 2 },
    { headerName: 'CPF', field: 'cpf', flex: 1 },
    { headerName: 'Tipo', field: 'tipoMovimentacao', flex: 1 },
    { headerName: 'Data', field: 'dataMovimentacao', flex: 1 },
    { headerName: 'Detalhes', field: 'detalhes', flex: 3 },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor() {
    this.filterForm = this.fb.group({
      dataInicio: [new Date(new Date().setMonth(new Date().getMonth() - 1))],
      dataFim: [new Date()],
      tiposMovimentacao: [[]]
    });
  }

  ngOnInit(): void {
    this.loadMovimentacoes();
  }

  loadMovimentacoes(): void {
    this.isLoading = true;
    const formValues = this.filterForm.value;
    const params = {
      dataInicio: formValues.dataInicio?.toISOString().split('T')[0],
      dataFim: formValues.dataFim?.toISOString().split('T')[0]
    };

    this.sibService.getMovimentacoesPendentes(params)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        this.rowData = data;
      });
  }

  onGridReady(params: GridReadyEvent<SibMovimentacao>) {
    this.gridApi = params.api;
  }

  isAnyRowSelected(): boolean {
    return this.gridApi?.getSelectedRows().length > 0;
  }

  gerarArquivo(): void {
    const selecionados = this.gridApi.getSelectedRows();
    if (selecionados.length === 0) {
      return;
    }

    this.isLoading = true;
    this.sibService.gerarArquivoSib(selecionados)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `SIB_LOTE_${new Date().toISOString().slice(0, 10)}.xml`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }
}
