import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-base-inline-form',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './base-inline-form.component.html',
  styleUrls: ['./base-inline-form.component.scss']
})
export class BaseInlineFormComponent {
  @Input() title!: string;
}

