import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-usuarios-layout',
  standalone: true,
  imports: [RouterModule, MatToolbarModule],
  templateUrl: './usuarios-layout.component.html',
  styleUrls: ['./usuarios-layout.component.scss']
})
export class UsuariosLayoutComponent {

}
