import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserProfileMenuComponent } from '../../../shared/components/user-profile-menu/user-profile-menu.component';

@Component({
  selector: 'app-usuario-layout',
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
  templateUrl: './usuario-layout.component.html',
  styleUrls: ['./usuario-layout.component.scss']
})
export class UsuarioLayoutComponent {

}
