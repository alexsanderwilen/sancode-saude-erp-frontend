import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-ans-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  data: any;
  constructor(private svc: DashboardService) { this.svc.metrics().subscribe(d => this.data = d); }
}

