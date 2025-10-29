import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserProfileMenuComponent } from '../../../shared/components/user-profile-menu/user-profile-menu.component';

@Component({
  selector: 'app-regulacao-ans-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    UserProfileMenuComponent
  ],
  templateUrl: './regulacao-ans-layout.html',
  styleUrls: ['./regulacao-ans-layout.css']
})
export class RegulacaoAnsLayoutComponent {}

