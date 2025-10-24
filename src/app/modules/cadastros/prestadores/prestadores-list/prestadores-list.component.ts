import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PrestadorService } from '../prestador.service';
import { Prestador } from '../prestador.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-prestadores-list',
  templateUrl: './prestadores-list.component.html',
  styleUrls: ['./prestadores-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AgGridModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule]
})
export class PrestadoresListComponent implements OnInit {

  prestadores: Prestador[] = [];

  colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'nomeRazaoSocial', headerName: 'Nome / Razão Social' },
    { field: 'cpfCnpj', headerName: 'CPF / CNPJ' },
    { field: 'cidade', headerName: 'Cidade' },
    { field: 'uf', headerName: 'UF' },
    { field: 'situacaoCadastral', headerName: 'Situação' }
  ];

  constructor(private prestadorService: PrestadorService) { }

  ngOnInit(): void {
    this.prestadorService.getPrestadores().subscribe(data => {
      this.prestadores = data;
    });
  }
}
