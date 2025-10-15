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

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatCardModule, MatButtonModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  public rowData$: Observable<Usuario[]> = of([]);

  public colDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Nome Completo', field: 'nomeCompleto', sortable: true, filter: true },
    { headerName: 'Username', field: 'username', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true },
    {
      headerName: 'Ações',
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="material-icons">edit</i>';
        editButton.addEventListener('click', () => this.onEdit(params.data.id));

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
        deleteButton.addEventListener('click', () => this.onDelete(params.data.id));

        const container = document.createElement('div');
        container.appendChild(editButton);
        container.appendChild(deleteButton);
        return container;
      }
    }
  ];

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.rowData$ = this.usuarioService.getUsuarios();
  }

  onEdit(id: number): void {
    this.router.navigate(['/cadastros/usuarios/edit', id]);
  }

  onDelete(id: number): void {
    // Adicionar confirmação antes de deletar
    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.rowData$ = this.usuarioService.getUsuarios();
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/cadastros/usuarios/new']);
  }
}
