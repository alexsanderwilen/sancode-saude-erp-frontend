import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { BeneficiarioService } from '../beneficiario.service';
import { Beneficiario, BeneficiarioEmail, BeneficiarioEndereco, BeneficiarioPlano, BeneficiarioTelefone, EstadoCivil, Parentesco, Sexo, Situacao } from '../beneficiario.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { DominioTipoService } from '../dominio-tipo/dominio-tipo.service';
import { DominioTipo } from '../dominio-tipo/dominio-tipo.model';
import { OperadoraEnderecoFormComponent } from '../operadoras-form/dialogs/operadora-endereco-form/operadora-endereco-form.component';
import { OperadoraTelefoneFormComponent } from '../operadoras-form/dialogs/operadora-telefone-form/operadora-telefone-form.component';
import { OperadoraEmailFormComponent } from '../operadoras-form/dialogs/operadora-email-form/operadora-email-form.component';
import { BeneficiarioPlanoFormComponent } from './dialogs/beneficiario-plano-form.component';
import { AgGridLocaleService } from '../../../shared/services/ag-grid-locale.service';
import { SexoEstadoService } from '../sexo-estado.service';
import { PlanoService } from '../plano/plano.service';
import { BeneficiarioPlanoService } from '../beneficiario-plano.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-beneficiarios-form',
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
  templateUrl: './beneficiarios-form.html',
  styleUrl: './beneficiarios-form.scss'
})
export class BeneficiariosFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  private beneficiarioId?: string;

  gridOptionsEnderecos: any;
  gridOptionsTelefones: any;
  gridOptionsEmails: any;

  colDefsEnderecos: any[];
  colDefsTelefones: any[];
  colDefsEmails: any[];

  dominioTiposEndereco: DominioTipo[] = [];
  dominioTiposTelefone: DominioTipo[] = [];
  dominioTiposEmail: DominioTipo[] = [];

  sexos: Sexo[] = [];
  estadosCivis: EstadoCivil[] = [];
  parentescos: Parentesco[] = [];
  situacoes: Situacao[] = [];
  planos: any[] = [];
  private planosMap = new Map<number, string>();
  private situacoesMap = new Map<number, string>();
  private parentescosMap = new Map<number, string>();

  // Planos (vínculos)
  beneficiarioPlanos: BeneficiarioPlano[] = [];
  gridOptionsPlanos: any;
  colDefsPlanos: any[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: BeneficiarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dominioTipoService: DominioTipoService,
    private agGridLocaleService: AgGridLocaleService,
    private sexoEstadoService: SexoEstadoService,
    private planoServiceFE: PlanoService,
    private beneficiarioPlanoService: BeneficiarioPlanoService
  ) {
    this.form = this.formBuilder.group({
      idSexo: [null, Validators.required],
      idEstadoCivil: [null, Validators.required],
      nomeCompleto: ['', [Validators.required, Validators.maxLength(150)]],
      nomeSocial: [''],
      cpf: ['', [Validators.required]],
      cns: [''],
      rg: [''],
      orgaoEmissor: [''],
      dataNascimento: [null, Validators.required],
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
      columnDefs: this.colDefsEnderecos,
      rowSelection: 'single',
      context: { componentParent: this, type: 'enderecos' },
      suppressRowClickSelection: true
    };
    this.gridOptionsTelefones = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      columnDefs: this.colDefsTelefones,
      rowSelection: 'single',
      context: { componentParent: this, type: 'telefones' },
      suppressRowClickSelection: true
    };
    this.gridOptionsEmails = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      columnDefs: this.colDefsEmails,
      rowSelection: 'single',
      context: { componentParent: this, type: 'emails' },
      suppressRowClickSelection: true
    };

    this.colDefsPlanos = [
      { headerName: 'Carteirinha', field: 'numeroCarteirinha', sortable: true, filter: true },
      { headerName: 'Plano ID', field: 'idPlano', width: 110, sortable: true, filter: true },
      { headerName: 'Plano', valueGetter: (p: any) => this.planoNome(p.data?.idPlano), flex: 1, sortable: true, filter: true },
      { headerName: 'Vínculo', field: 'tipoVinculo', width: 120, sortable: true, filter: true },
      { headerName: 'Situação ID', field: 'idSituacao', width: 130, sortable: true, filter: true },
      { headerName: 'Situação', valueGetter: (p: any) => this.situacaoNome(p.data?.idSituacao), width: 150, sortable: true, filter: true },
      { headerName: 'Parentesco ID', field: 'idParentesco', width: 150, sortable: true, filter: true },
      { headerName: 'Parentesco', valueGetter: (p: any) => this.parentescoNome(p.data?.idParentesco), width: 160, sortable: true, filter: true },
      { headerName: 'Início', field: 'dataInicioVigencia', width: 120, sortable: true, filter: true },
      { headerName: 'Fim', field: 'dataFimVigencia', width: 120, sortable: true, filter: true },
      { headerName: 'Ações', cellRenderer: this.actionsRenderer.bind(this), width: 140 }
    ];
    this.gridOptionsPlanos = {
      ...this.agGridLocaleService.getDefaultGridOptions(),
      columnDefs: this.colDefsPlanos,
      rowSelection: 'single',
      context: { componentParent: this, type: 'planos' },
      suppressRowClickSelection: true
    };
  }

  ngOnInit(): void {
    this.loadDominioTipos();
    this.sexoEstadoService.getSexos().subscribe(data => this.sexos = data.filter(s => s.ativo));
    this.sexoEstadoService.getEstadosCivis().subscribe(data => this.estadosCivis = data.filter(e => e.ativo));
    this.sexoEstadoService.getParentescos().subscribe(d => {
      this.parentescos = d.filter(x => x.ativo);
      this.parentescosMap = new Map(this.parentescos.map(p => [p.idParentesco, p.descricao]));
    });
    this.sexoEstadoService.getSituacoes().subscribe(d => {
      this.situacoes = d.filter(x => x.ativo);
      this.situacoesMap = new Map(this.situacoes.map(s => [s.idSituacao, s.descricao]));
    });
    this.planoServiceFE.getPlanos().subscribe(list => {
      this.planos = list;
      this.planosMap = new Map(this.planos.map((p: any) => [p.id, p.nomeComercial]));
    });

    this.beneficiarioId = this.route.snapshot.params['id'];
    if (this.beneficiarioId) {
      this.isEditMode = true;
      this.service.getById(this.beneficiarioId).subscribe(model => {
        this.form.patchValue(model);
        model.enderecos.forEach(e => this.enderecos.push(this.createEnderecoFormGroup(e)));
        model.telefones.forEach(t => this.telefones.push(this.createTelefoneFormGroup(t)));
        model.emails.forEach(em => this.emails.push(this.createEmailFormGroup(em)));
      });
      this.loadPlanos();
    }
  }

  loadPlanos(): void {
    if (!this.beneficiarioId) return;
    this.beneficiarioPlanoService.listByBeneficiario(this.beneficiarioId).subscribe(v => this.beneficiarioPlanos = v);
  }

  onSexoOpened(opened: boolean): void {
    if (opened) {
      this.refreshSexos();
    }
  }

  onEstadoCivilOpened(opened: boolean): void {
    if (opened) {
      this.refreshEstadosCivis();
    }
  }

  refreshSexos(): void {
    this.sexoEstadoService.getSexos().subscribe(data => this.sexos = data.filter(s => s.ativo));
  }

  refreshEstadosCivis(): void {
    this.sexoEstadoService.getEstadosCivis().subscribe(data => this.estadosCivis = data.filter(e => e.ativo));
  }

  planoNome(id?: number): string {
    if (id == null) return '';
    return this.planosMap.get(id) || '';
  }

  situacaoNome(id?: number): string {
    if (id == null) return '';
    return this.situacoesMap.get(id) || '';
  }

  parentescoNome(id?: number): string {
    if (id == null) return '';
    return this.parentescosMap.get(id) || '';
  }

  loadDominioTipos(): void {
    this.dominioTipoService.findAll().subscribe({
      next: (data: DominioTipo[]) => {
        this.dominioTiposEndereco = data.filter(d => d.tipoDoTipo === 'ENDERECO' && d.status);
        this.dominioTiposTelefone = data.filter(d => d.tipoDoTipo === 'TELEFONE' && d.status);
        this.dominioTiposEmail = data.filter(d => d.tipoDoTipo === 'EMAIL' && d.status);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar tipos de domínio.', 'Fechar', { duration: 3000 });
      }
    });
  }

  get enderecos(): FormArray { return this.form.get('enderecos') as FormArray; }
  get telefones(): FormArray { return this.form.get('telefones') as FormArray; }
  get emails(): FormArray { return this.form.get('emails') as FormArray; }

  createEnderecoFormGroup(endereco?: BeneficiarioEndereco): FormGroup {
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

  createTelefoneFormGroup(telefone?: BeneficiarioTelefone): FormGroup {
    return this.formBuilder.group({
      id: [telefone?.id],
      tipo: [telefone?.tipo || '', Validators.required],
      ddd: [telefone?.ddd || '', Validators.required],
      numero: [telefone?.numero || '', Validators.required],
      ramal: [telefone?.ramal || ''],
      whatsapp: [telefone?.whatsapp || false]
    });
  }

  createEmailFormGroup(email?: BeneficiarioEmail): FormGroup {
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
    // Atualiza os domínios antes de abrir
    this.dominioTipoService.findAll().subscribe({
      next: (all: DominioTipo[]) => {
        this.dominioTiposEndereco = all.filter((dt) => dt.tipoDoTipo === 'ENDERECO' && dt.status);
        this.dominioTiposTelefone = all.filter((dt) => dt.tipoDoTipo === 'TELEFONE' && dt.status);
        this.dominioTiposEmail = all.filter((dt) => dt.tipoDoTipo === 'EMAIL' && dt.status);

        let dialogRef;
        const dialogData = { ...data } as any;
        if (type === 'enderecos') {
          dialogData.dominioTipos = this.dominioTiposEndereco;
          dialogRef = this.dialog.open(OperadoraEnderecoFormComponent, { data: dialogData, panelClass: 'sancode-cadastro-theme', disableClose: true });
        } else if (type === 'telefones') {
          dialogData.dominioTipos = this.dominioTiposTelefone;
          dialogRef = this.dialog.open(OperadoraTelefoneFormComponent, { data: dialogData, panelClass: 'sancode-cadastro-theme', disableClose: true });
        } else if (type === 'emails') {
          dialogData.dominioTipos = this.dominioTiposEmail;
          dialogRef = this.dialog.open(OperadoraEmailFormComponent, { data: dialogData, width: '500px', panelClass: 'sancode-cadastro-theme', disableClose: true });
        } else if (type === 'planos') {
          // Recarrega listas auxiliares antes de abrir
          forkJoin({
            planos: this.planoServiceFE.getPlanos(),
            parentescos: this.sexoEstadoService.getParentescos(),
            situacoes: this.sexoEstadoService.getSituacoes()
          }).subscribe(({ planos, parentescos, situacoes }) => {
            this.planos = planos;
            this.planosMap = new Map(this.planos.map((p: any) => [p.id, p.nomeComercial]));
            this.parentescos = parentescos.filter(p => p.ativo);
            this.parentescosMap = new Map(this.parentescos.map(p => [p.idParentesco, p.descricao]));
            this.situacoes = situacoes.filter(s => s.ativo);
            this.situacoesMap = new Map(this.situacoes.map(s => [s.idSituacao, s.descricao]));

            const dialogPayload = {
              ...data,
              planos: this.planos,
              parentescos: this.parentescos,
              situacoes: this.situacoes,
              title: data?.id ? 'Editar Plano do Beneficiário' : 'Adicionar Plano ao Beneficiário'
            };
            this.dialog.open(BeneficiarioPlanoFormComponent, { data: dialogPayload, panelClass: 'sancode-cadastro-theme', disableClose: true })
              .afterClosed().subscribe(result => {
                if (result) {
                  const payload = result as BeneficiarioPlano;
                  payload.idBeneficiario = this.beneficiarioId!;
                  if (result.id) {
                    this.beneficiarioPlanoService.update(result.id, payload).subscribe(() => this.loadPlanos());
                  } else {
                    this.beneficiarioPlanoService.create(this.beneficiarioId!, payload).subscribe(() => this.loadPlanos());
                  }
                }
              });
          });
          return; // evita executar o afterClosed comum abaixo
        }

        dialogRef?.afterClosed().subscribe(result => {
          if (result) {
            if (type === 'planos') {
              // create or update vínculo via API
              const payload = result as BeneficiarioPlano;
              payload.idBeneficiario = this.beneficiarioId!;
              if (result.id) {
                this.beneficiarioPlanoService.update(result.id, payload).subscribe(() => this.loadPlanos());
              } else {
                this.beneficiarioPlanoService.create(this.beneficiarioId!, payload).subscribe(() => this.loadPlanos());
              }
            } else {
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
          }
        });
      }
    });
  }

  removerItem(type: string, index: number): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar Exclusão', message: `Tem certeza que deseja excluir este ${type.slice(0, -1)}?` }
    }).afterClosed().subscribe(result => {
      if (result) {
        if (type === 'planos') {
          const item = this.beneficiarioPlanos[index];
          if (item?.id) {
            this.beneficiarioPlanoService.delete(item.id).subscribe({
              next: () => this.loadPlanos()
            });
          }
        } else {
          const formArray = this.form.get(type) as FormArray;
          formArray.removeAt(index);
        }
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.snackBar.open('Formulário inválido! Verifique os campos.', 'Fechar', { duration: 3000 });
      return;
    }
    const model: Beneficiario = this.form.value;
    const req = this.isEditMode ? this.service.update(this.beneficiarioId!, model) : this.service.create(model);
    req.subscribe({
      next: () => {
        this.snackBar.open('Beneficiário salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/cadastros/beneficiarios']);
      },
      error: (err) => {
        console.error('Erro ao salvar beneficiário:', err);
        this.snackBar.open('Erro ao salvar beneficiário. ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cadastros/beneficiarios']);
  }
}
