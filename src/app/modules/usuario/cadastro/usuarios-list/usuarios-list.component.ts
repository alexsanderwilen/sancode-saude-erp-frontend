import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';
import { ColDef } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  public rowData$: Observable<Usuario[]> = of([]);

  public colDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, maxWidth: 100 },
    { headerName: 'Nome Completo', field: 'nomeCompleto', sortable: true, filter: true },
    { headerName: 'Username', field: 'username', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, maxWidth: 120 },
    {
      headerName: 'Ações',
      cellRenderer: (params: any) => {
        const eGui = document.createElement('div');
        eGui.innerHTML = `
          <button mat-icon-button (click)="onEdit(${params.data.id})">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="onDelete(${params.data.id})">
            <mat-icon>delete</mat-icon>
          </button>
        `;
        // Attach event listeners to the buttons
        eGui.querySelector('[mat-icon-button][(click^="onEdit"] ')
          ?.addEventListener('click', () => this.onEdit(params.data.id));
        eGui.querySelector('[mat-icon-button][(click^="onDelete"] ')
          ?.addEventListener('click', () => this.onDelete(params.data.id));
        return eGui;
      },
      width: 120
    }
  ];

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.rowData$ = this.usuarioService.getUsuarios();
  }

  onEdit(id: number): void {
    this.router.navigate(['/usuarios/cadastro/edit', id]);
  }

  onDelete(id: number): void {
    // TODO: Adicionar confirmação antes de deletar
    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.rowData$ = this.usuarioService.getUsuarios();
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/usuarios/cadastro/new']);
  }
}