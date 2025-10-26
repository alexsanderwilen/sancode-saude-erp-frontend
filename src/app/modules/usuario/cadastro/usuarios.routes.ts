import { Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';

export const USUARIOS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UsuariosListComponent },
  { path: 'new', component: UsuariosFormComponent },
  { path: 'edit/:id', component: UsuariosFormComponent }
];

