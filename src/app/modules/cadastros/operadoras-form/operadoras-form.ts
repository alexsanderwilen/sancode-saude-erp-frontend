import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { OperadoraService } from '../operadora.service';
import { Operadora, OperadoraEndereco, OperadoraTelefone, OperadoraEmail } from '../operadora.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { DominioTipoService } from '../dominio-tipo/dominio-tipo.service';
import { DominioTipo } from '../dominio-tipo/dominio-tipo.model';
import { OperadoraEnderecoFormComponent } from './dialogs/operadora-endereco-form/operadora-endereco-form.component';
import { OperadoraTelefoneFormComponent } from './dialogs/operadora-telefone-form/operadora-telefone-form.component';
import { OperadoraEmailFormComponent } from './dialogs/operadora-email-form/operadora-email-form.component';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';

@Component({
  selector: 'app-operadoras-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatCheckboxModule,
    NgxMaskDirective,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    AgGridModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter(), provideNgxMask()],
  templateUrl: './operadoras-form.html',
  styleUrl: './operadoras-form.scss'
})
export class OperadorasFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  private operadoraId?: string;

  gridOptionsEnderecos: any;
  gridOptionsTelefones: any;
  gridOptionsEmails: any;

  colDefsEnderecos: any[];
  colDefsTelefones: any[];
  colDefsEmails: any[];

  dominioTiposEndereco: DominioTipo[] = [];
  dominioTiposTelefone: DominioTipo[] = [];
  dominioTiposEmail: DominioTipo[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private operadoraService: OperadoraService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dominioTipoService: DominioTipoService,
    private agGridLocaleService: AgGridLocaleService
  ) {
    this.form = this.formBuilder.group({
      registroAns: ['', [Validators.required, Validators.maxLength(6)]],
      cnpj: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required, Validators.maxLength(255)]],
      nomeFantasia: [''],
      dataRegistroAns: [null],
      ativo: [true],
      enderecos: this.formBuilder.array([]),
      telefones: this.formBuilder.array([]),
      emails: this.formBuilder.array([])
    });

    this.colDefsEnderecos = [
      { headerName: 'Tipo', field: 'tipo', sortable: true, filter: true },
      { headerName: 'CEP', field: 'cep', sortable: true, filter: true },
      { headerName: 'Logradouro', field: 'logradouro', sortable: true, filter: true },
      { headerName: 'Cidade', field: 'cidade', sortable: true, filter: true },
      { headerName: 'UF', field: 'uf', sortable: true, filter: true },
      { headerName: 'Ações', cellRenderer: this.actionsRenderer.bind(this) }
    ];

    this.colDefsTelefones = [
      { headerName: 'Tipo', field: 'tipo', sortable: true, filter: true },
      { headerName: 'DDD', field: 'ddd', sortable: true, filter: true },
      { headerName: 'Número', field: 'numero', sortable: true, filter: true },
      { headerName: 'WhatsApp', field: 'whatsapp', sortable: true, filter: true },
      { headerName: 'Ações', cellRenderer: this.actionsRenderer.bind(this) }
    ];

    this.colDefsEmails = [
      { headerName: 'Tipo', field: 'tipo', sortable: true, filter: true },
      { headerName: 'E-mail', field: 'email', sortable: true, filter: true, flex: 1 },
      { headerName: 'Ações', cellRenderer: this.actionsRenderer.bind(this) }
    ];

    this.gridOptionsEnderecos = { 
      ...this.agGridLocaleService.getDefaultGridOptions(),
      context: { componentParent: this, type: 'enderecos' }, 
      suppressRowClickSelection: true 
    };
    this.gridOptionsTelefones = { 
      ...this.agGridLocaleService.getDefaultGridOptions(),
      context: { componentParent: this, type: 'telefones' }, 
      suppressRowClickSelection: true
    };
    this.gridOptionsEmails = { 
      ...this.agGridLocaleService.getDefaultGridOptions(),
      context: { componentParent: this, type: 'emails' }, 
      suppressRowClickSelection: true
    };
  }

  ngOnInit(): void {
    this.loadDominioTipos();

    this.operadoraId = this.route.snapshot.params['id'];
    if (this.operadoraId) {
      this.isEditMode = true;
      this.operadoraService.getById(this.operadoraId).subscribe(operadora => {
        this.form.patchValue(operadora);
        operadora.enderecos.forEach(endereco => this.enderecos.push(this.createEnderecoFormGroup(endereco)));
        operadora.telefones.forEach(telefone => this.telefones.push(this.createTelefoneFormGroup(telefone)));
        operadora.emails.forEach(email => this.emails.push(this.createEmailFormGroup(email)));
      });
    }
  }

  loadDominioTipos(): void {
    this.dominioTipoService.findAll().subscribe({
      next: (data: DominioTipo[]) => {
        this.dominioTiposEndereco = data.filter((dt: DominioTipo) => dt.tipoDoTipo === 'ENDERECO' && dt.status);
        this.dominioTiposTelefone = data.filter((dt: DominioTipo) => dt.tipoDoTipo === 'TELEFONE' && dt.status);
        this.dominioTiposEmail = data.filter((dt: DominioTipo) => dt.tipoDoTipo === 'EMAIL' && dt.status);
      },
      error: (error: any) => {
        console.error('Erro ao carregar tipos de domínio:', error);
        this.snackBar.open('Erro ao carregar tipos de domínio.', 'Fechar', { duration: 3000 });
      },
    });
  }

  get enderecos(): FormArray {
    return this.form.get('enderecos') as FormArray;
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  createEnderecoFormGroup(endereco?: OperadoraEndereco): FormGroup {
    return this.formBuilder.group({
      id: [endereco?.id],
      tipo: [endereco?.tipo || '', Validators.required],
      cep: [endereco?.cep || '', Validators.required],
      logradouro: [endereco?.logradouro || '', Validators.required],
      numero: [endereco?.numero || '', Validators.required],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || '', Validators.required],
      cidade: [endereco?.cidade || '', Validators.required],
      uf: [endereco?.uf || '', Validators.required],
      pais: [endereco?.pais || 'BRASIL', Validators.required],
      latitude: [endereco?.latitude],
      longitude: [endereco?.longitude]
    });
  }

  createTelefoneFormGroup(telefone?: OperadoraTelefone): FormGroup {
    return this.formBuilder.group({
      id: [telefone?.id],
      tipo: [telefone?.tipo || '', Validators.required],
      ddd: [telefone?.ddd || '', Validators.required],
      numero: [telefone?.numero || '', Validators.required],
      ramal: [telefone?.ramal || ''],
      whatsapp: [telefone?.whatsapp || false]
    });
  }

  createEmailFormGroup(email?: OperadoraEmail): FormGroup {
    return this.formBuilder.group({
      id: [email?.id],
      tipo: [email?.tipo || '', Validators.required],
      email: [email?.email || '', [Validators.required, Validators.email]]
    });
  }

  actionsRenderer(params: any) {
    const div = document.createElement('div');
    div.innerHTML = `
      <button data-action="edit" class="btn btn-sm btn-outline-primary">Editar</button>
      <button data-action="delete" class="btn btn-sm btn-outline-danger">Excluir</button>
    `;
    const editButton = div.querySelector('[data-action="edit"]');
    const deleteButton = div.querySelector('[data-action="delete"]');

    editButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      params.context.componentParent.openDialog(params.context.type, params.node.rowIndex, params.data);
    });

    deleteButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      params.context.componentParent.removerItem(params.context.type, params.node.rowIndex);
    });

    return div;
  }

  openDialog(type: string, index?: number, data?: any): void {
    // Sempre buscar os tipos de domínio mais recentes antes de abrir o diálogo
    this.dominioTipoService.findAll().subscribe({
      next: (all: DominioTipo[]) => {
        this.dominioTiposEndereco = all.filter((dt) => dt.tipoDoTipo === 'ENDERECO' && dt.status);
        this.dominioTiposTelefone = all.filter((dt) => dt.tipoDoTipo === 'TELEFONE' && dt.status);
        this.dominioTiposEmail = all.filter((dt) => dt.tipoDoTipo === 'EMAIL' && dt.status);

        let dialogRef;
        const dialogData = { ...data } as any;
        if (type === 'enderecos') {
          dialogData.dominioTipos = this.dominioTiposEndereco;
          dialogRef = this.dialog.open(OperadoraEnderecoFormComponent, { data: dialogData, panelClass: 'sancode-cadastro-theme' });
        } else if (type === 'telefones') {
          dialogData.dominioTipos = this.dominioTiposTelefone;
          dialogRef = this.dialog.open(OperadoraTelefoneFormComponent, { data: dialogData, panelClass: 'sancode-cadastro-theme' });
        } else if (type === 'emails') {
          dialogData.dominioTipos = this.dominioTiposEmail;
          dialogRef = this.dialog.open(OperadoraEmailFormComponent, { data: dialogData, width: '500px', panelClass: 'sancode-cadastro-theme' });
        }

        dialogRef?.afterClosed().subscribe(result => {
          if (result) {
            const formArray = this.form.get(type) as FormArray;
            if (index !== undefined) {
              formArray.at(index).patchValue(result);
            } else {
              if (type === 'enderecos') {
                formArray.push(this.createEnderecoFormGroup(result));
              } else if (type === 'telefones') {
                formArray.push(this.createTelefoneFormGroup(result));
              } else if (type === 'emails') {
                formArray.push(this.createEmailFormGroup(result));
              }
            }
          }
        });
      },
      error: () => {
        // Em caso de erro ao atualizar, segue com dados em memória para não travar o fluxo
        let dialogRef;
        const dialogData = { ...data } as any;
        if (type === 'enderecos') {
          dialogData.dominioTipos = this.dominioTiposEndereco;
          dialogRef = this.dialog.open(OperadoraEnderecoFormComponent, { data: dialogData, panelClass: 'sancode-cadastro-theme' });
        } else if (type === 'telefones') {
          dialogData.dominioTipos = this.dominioTiposTelefone;
          dialogRef = this.dialog.open(OperadoraTelefoneFormComponent, { data: dialogData, panelClass: 'sancode-cadastro-theme' });
        } else if (type === 'emails') {
          dialogData.dominioTipos = this.dominioTiposEmail;
          dialogRef = this.dialog.open(OperadoraEmailFormComponent, { data: dialogData, width: '500px', panelClass: 'sancode-cadastro-theme' });
        }
      }
    });
  }

  removerItem(type: string, index: number): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir este ${type.slice(0, -1)}?`
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const formArray = this.form.get(type) as FormArray;
        formArray.removeAt(index);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.snackBar.open('Formulário inválido! Verifique todos os campos.', 'Fechar', { duration: 3000 });
      return;
    }

    const operadora: Operadora = this.form.value;
    const request = this.isEditMode
      ? this.operadoraService.update(this.operadoraId!, operadora)
      : this.operadoraService.create(operadora);

    request.subscribe({
      next: () => {
        this.snackBar.open('Operadora salva com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/cadastros/operadoras']);
      },
      error: (err) => {
        console.error('Erro ao salvar operadora:', err);
        this.snackBar.open('Erro ao salvar operadora. Detalhes: ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cadastros/operadoras']);
  }
}

