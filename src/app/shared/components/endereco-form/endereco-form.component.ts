import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-endereco-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './endereco-form.component.html',
  styleUrls: ['./endereco-form.component.scss']
})
export class EnderecoFormComponent {
  @Input() formGroup!: FormGroup;

  // Lógica de busca de CEP será adicionada aqui no futuro
  buscarCep() {
    // TODO: Implementar a busca na API ViaCEP
  }
}

