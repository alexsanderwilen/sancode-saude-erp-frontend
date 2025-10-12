import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DominioTipo } from '../dominio-tipo.model';
import { DominioTipoService } from '../dominio-tipo.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-dominio-tipo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,

    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './dominio-tipo-list.html',
  styleUrl: './dominio-tipo-list.scss',
})
export class DominioTipoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'tipoDoTipo', 'descricao', 'ativo', 'actions'];
  dataSource = new MatTableDataSource<DominioTipo>();
  private searchTerms = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dominioTipoService = inject(DominioTipoService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadDominioTipos();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.applyFilter(term);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDominioTipos(): void {
    this.dominioTipoService.findAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de domínio:', error);
        this.snackBar.open('Erro ao carregar tipos de domínio.', 'Fechar', { duration: 3000 });
      },
    });
  }

  onSearch(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerms.next(filterValue.trim().toLowerCase());
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addDominioTipo(): void {
    this.router.navigate(['/cadastros/dominio-tipos/new']);
  }

  editDominioTipo(id: number): void {
    this.router.navigate([`/cadastros/dominio-tipos/edit/${id}`]);
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
