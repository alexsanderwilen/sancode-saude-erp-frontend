import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; 
import { DominioTipo } from '../dominio-tipo.model';
import { DominioTipoService } from '../dominio-tipo.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DominioTipoFormComponent } from '../dominio-tipo-form/dominio-tipo-form';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { StatusChipRenderer } from './status-chip-renderer.component';

@Component({
  selector: 'app-dominio-tipo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    AgGridModule,
    MatIconModule,
  ],
  templateUrl: './dominio-tipo-list.html',
  styleUrl: './dominio-tipo-list.scss',
})
export class DominioTipoListComponent implements OnInit {
  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    domLayout: 'normal',
  };
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true, width: 90 },
    { field: 'tipoDoTipo', headerName: 'Tipo', sortable: true, filter: true, flex: 1 },
    { field: 'descricao', headerName: 'Descrição', sortable: true, filter: true, flex: 2 },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: StatusChipRenderer,
    },
    {
      headerName: 'Ações',
      width: 150,
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <button title="Editar" data-action="edit" class="btn btn-sm btn-outline-primary me-1">
            <i class="fa fa-pencil" data-action="edit"></i>
          </button>
          <button title="Excluir" data-action="delete" class="btn btn-sm btn-outline-danger">
            <i class="fa fa-trash" data-action="delete"></i>
          </button>
        `;

        const editButton = eDiv.querySelector('.btn-outline-primary');
        if (editButton) {
          editButton.addEventListener('click', () => this.openDialog(params.data));
        }

        const deleteButton = eDiv.querySelector('.btn-outline-danger');
        if (deleteButton) {
          deleteButton.addEventListener('click', () => this.deleteDominioTipo(params.data.id));
        }

        return eDiv;
      },
    },
  ];

  private gridApi!: GridApi;

  private dominioTipoService = inject(DominioTipoService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit(): void {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.loadDominioTipos();
  }

  loadDominioTipos(): void {
    this.dominioTipoService.findAll().subscribe({
      next: (data) => {
        if (this.gridApi) {
          this.gridApi.updateGridOptions({ rowData: data });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de domínio:', error);
        this.snackBar.open('Erro ao carregar tipos de domínio.', 'Fechar', { duration: 3000 });
      },
    });
  }

  openDialog(data?: DominioTipo): void {
    const dialogRef = this.dialog.open(DominioTipoFormComponent, {
      width: '700px',
      panelClass: 'sancode-cadastro-theme',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isEdit = !!data;
        const request = isEdit 
          ? this.dominioTipoService.update(data!.id, result)
          : this.dominioTipoService.create(result);
        
        const successMessage = isEdit 
          ? 'Tipo de domínio atualizado com sucesso!'
          : 'Tipo de domínio criado com sucesso!';

        request.subscribe({
          next: () => {
            this.snackBar.open(successMessage, 'Fechar', { duration: 3000 });
            this.loadDominioTipos();
          },
          error: (error) => {
            console.error('Erro ao salvar tipo de domínio:', error);
            this.snackBar.open('Erro ao salvar tipo de domínio.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteDominioTipo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja excluir este tipo de domínio?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dominioTipoService.delete(id).subscribe({
          next: () => {
            this.snackBar.open('Tipo de domínio excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadDominioTipos();
          },
          error: (error) => {
            console.error('Erro ao excluir tipo de domínio:', error);
            this.snackBar.open('Erro ao excluir tipo de domínio.', 'Fechar', { duration: 3000 });
          },
        });
      }
    });
  }
}
