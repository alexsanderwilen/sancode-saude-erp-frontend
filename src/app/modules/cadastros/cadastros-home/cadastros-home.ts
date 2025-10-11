import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cadastros-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './cadastros-home.html',
  styleUrl: './cadastros-home.scss'
})
export class CadastrosHomeComponent {

}
