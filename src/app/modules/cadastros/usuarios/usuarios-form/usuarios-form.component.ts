import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss']
})
export class UsuariosFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  private id!: number;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEditMode = true;
      this.usuarioService.getUsuario(this.id).subscribe(usuario => {
        this.form.patchValue(usuario);
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      // Acesso e Identificação
      nomeCompleto: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : Validators.required], // Senha obrigatória apenas na criação
      status: ['ATIVO', Validators.required],
      nomeSocial: [''],
      apelido: [''],
      celular: [''],

      // Dados Pessoais
      cpf: [''],
      rg: [''],
      dataNascimento: [null],
      sexo: [null],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const usuario: Usuario = this.form.value;

    const operation = this.isEditMode
      ? this.usuarioService.updateUsuario(this.id, usuario)
      : this.usuarioService.createUsuario(usuario);

    operation.subscribe({
      next: () => {
        this.snackBar.open('Usuário salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/cadastros/usuarios']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar usuário.', 'Fechar', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/cadastros/usuarios']);
  }
}
