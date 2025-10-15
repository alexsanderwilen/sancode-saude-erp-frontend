import { Routes } from '@angular/router';
import { UsuarioLayoutComponent } from './usuario-layout/usuario-layout.component';
import { UsuarioHomeComponent } from './usuario-home/usuario-home.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    component: UsuarioLayoutComponent,
    children: [
      { path: '', component: UsuarioHomeComponent, title: 'Usuários' },
      {
        path: 'cadastro',
        loadChildren: () => import('./cadastro/usuarios.routes').then(m => m.USUARIOS_ROUTES)
      }
    ]
  }
];
