import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioTelefone, UsuarioEmail } from '../usuario.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridLocaleService } from '../../../../shared/services/ag-grid-locale.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { UsuarioTelefoneFormComponent } from './dialogs/usuario-telefone-form/usuario-telefone-form.component';
import { UsuarioEmailFormComponent } from './dialogs/usuario-email-form/usuario-email-form.component';
import { MatIconModule } from '@angular/material/icon';
import { DominioTipoService } from '../../../cadastros/dominio-tipo/dominio-tipo.service';
import { DominioTipo } from '../../../cadastros/dominio-tipo/dominio-tipo.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatTabsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule, MatDatepickerModule, MatNativeDateModule,
    MatSelectModule, MatDialogModule, AgGridModule, MatIconModule, NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss']
})
export class UsuariosFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  private id!: number;

  gridOptionsTelefones: GridOptions;
  gridOptionsEmails: GridOptions;
  colDefsTelefones: ColDef[];
  colDefsEmails: ColDef[];

  dominioTiposTelefone: DominioTipo[] = [];
  dominioTiposEmail: DominioTipo[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private agGridLocaleService: AgGridLocaleService,
    private dominioTipoService: DominioTipoService
  ) {
    this.colDefsTelefones = [
      { headerName: 'Tipo', field: 'tipo', sortable: true, filter: true },
      { headerName: 'DDD', field: 'ddd', width: 100 },
      { headerName: 'Número', field: 'numero' },
      { headerName: 'WhatsApp', field: 'whatsapp', cellRenderer: (p: any) => p.value ? 'Sim' : 'Não', width: 120 },
      { headerName: 'Ações', cellRenderer: this.actionsRenderer.bind(this), width: 100 }
    ];

    this.colDefsEmails = [
      { headerName: 'Tipo', field: 'tipo', sortable: true, filter: true },
      { headerName: 'E-mail', field: 'email', flex: 1 },
      { headerName: 'Ações', cellRenderer: this.actionsRenderer.bind(this), width: 100 }
    ];

    this.gridOptionsTelefones = { ...this.agGridLocaleService.getDefaultGridOptions(), context: { componentParent: this, type: 'telefones' } };
    this.gridOptionsEmails = { ...this.agGridLocaleService.getDefaultGridOptions(), context: { componentParent: this, type: 'emails' } };
  }

  ngOnInit(): void {
    this.loadDominioTipos();
    this.initForm();
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEditMode = true;
      this.usuarioService.getUsuario(this.id).subscribe(usuario => {
        this.form.patchValue(usuario);
        (usuario.telefones || []).forEach(item => this.telefones.push(this.createTelefoneFormGroup(item)));
        (usuario.emails || []).forEach(item => this.emails.push(this.createEmailFormGroup(item)));
        if (this.isEditMode) {
          this.form.get('password')?.clearValidators();
          this.form.get('password')?.updateValueAndValidity();
        }
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [null],
      nomeCompleto: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      status: ['ATIVO', Validators.required],
      nomeSocial: [''],
      apelido: [''],
      cpf: [''],
      rg: [''],
      dataNascimento: [null],
      sexo: [null],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
      cep: [''],
      telefones: this.fb.array([]),
      emails: this.fb.array([])
    });
  }

  get telefones(): FormArray { return this.form.get('telefones') as FormArray; }
  get emails(): FormArray { return this.form.get('emails') as FormArray; }

  createTelefoneFormGroup(item?: UsuarioTelefone): FormGroup {
    return this.fb.group({ id: [item?.id || null], tipo: [item?.tipo || ''], ddd: [item?.ddd || ''], numero: [item?.numero || ''], ramal: [item?.ramal || ''], whatsapp: [item?.whatsapp || false] });
  }

  createEmailFormGroup(item?: UsuarioEmail): FormGroup {
    return this.fb.group({ id: [item?.id || null], tipo: [item?.tipo || ''], email: [item?.email || '', Validators.email] });
  }

  actionsRenderer(params: any) {
    const div = document.createElement('div');
    div.innerHTML = `<button class="btn btn-sm btn-outline-primary">Editar</button> <button class="btn btn-sm btn-outline-danger">Excluir</button>`;
    const editButton = div.querySelector('button:first-child')!;
    editButton.addEventListener('click', (event) => {
      event.preventDefault(); // Adicionar esta linha
      event.stopPropagation();
      params.context.componentParent.openDialog(params.context.type, params.node.rowIndex, params.data);
    });

    const deleteButton = div.querySelector('button:last-child')!;
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault(); // Adicionar esta linha
      event.stopPropagation();
      params.context.componentParent.removerItem(params.context.type, params.node.rowIndex);
    });
    return div;
  }

  openDialog(type: string, index?: number, data?: any): void {
    let dialogRef;
    if (type === 'telefones') {
      const dialogData = { ...data, dominioTipos: this.dominioTiposTelefone };
      dialogRef = this.dialog.open(UsuarioTelefoneFormComponent, { data: dialogData, width: '500px', panelClass: 'sancode-usuario-theme' });
    } else {
      const dialogData = { ...data, dominioTipos: this.dominioTiposEmail };
      dialogRef = this.dialog.open(UsuarioEmailFormComponent, { data: dialogData, width: '500px', panelClass: 'sancode-usuario-theme' });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const formArray = this.form.get(type) as FormArray;
      if (index !== undefined) {
        formArray.at(index).patchValue(result);
      } else {
        const formGroup = type === 'telefones' ? this.createTelefoneFormGroup(result) : this.createEmailFormGroup(result);
        formArray.push(formGroup);
      }
    });
  }

  removerItem(type: string, index: number): void {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Confirmar Exclusão', message: `Tem certeza que deseja excluir este item?` } })
      .afterClosed().subscribe(result => {
        if (result) {
          (this.form.get(type) as FormArray).removeAt(index);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) { return; }
    const usuario: Usuario = this.form.value;
    const operation = this.isEditMode ? this.usuarioService.updateUsuario(this.id, usuario) : this.usuarioService.createUsuario(usuario);
    operation.subscribe({
      next: () => {
        this.snackBar.open('Usuário salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/usuarios/cadastro']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erro ao salvar usuário.', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadDominioTipos(): void {
    this.dominioTipoService.findAll().subscribe({
      next: (data: DominioTipo[]) => {
        this.dominioTiposTelefone = data.filter((dt: DominioTipo) => dt.tipoDoTipo === 'TELEFONE' && dt.status);
        this.dominioTiposEmail = data.filter((dt: DominioTipo) => dt.tipoDoTipo === 'EMAIL' && dt.status);
      },
      error: (error: any) => {
        console.error('Erro ao carregar tipos de domínio:', error);
        this.snackBar.open('Erro ao carregar tipos de domínio.', 'Fechar', { duration: 3000 });
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/usuarios/cadastro']);
  }
}

