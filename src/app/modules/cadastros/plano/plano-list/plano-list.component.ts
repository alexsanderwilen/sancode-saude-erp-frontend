import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PlanoService } from '../plano.service';
import { Plano } from '../plano.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plano-list',
  templateUrl: './plano-list.component.html',
  styleUrls: ['./plano-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AgGridModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule]
})
export class PlanoListComponent implements OnInit {

  planos: Plano[] = [];

  colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'nomeComercial', headerName: 'Nome Comercial' },
    { field: 'registroAns', headerName: 'Registro ANS' },
    { field: 'ativo', headerName: 'Ativo' }
  ];

  constructor(private planoService: PlanoService) { }

  ngOnInit(): void {
    this.planoService.getPlanos().subscribe(data => {
      this.planos = data;
    });
  }
}
