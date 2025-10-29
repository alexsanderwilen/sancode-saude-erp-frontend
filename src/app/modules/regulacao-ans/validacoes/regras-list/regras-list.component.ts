import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-ans-regras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './regras-list.component.html',
  styleUrls: ['./regras-list.component.css']
})
export class RegrasListComponent {
  regras: any[] = [];
  constructor(private svc: ValidationsService) { this.svc.rules().subscribe(r => this.regras = r); }
}

