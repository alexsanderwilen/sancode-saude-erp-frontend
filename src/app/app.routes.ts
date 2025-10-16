import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'cadastros',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/cadastros/cadastros.routes').then(m => m.CADASTROS_ROUTES)
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/usuario/usuario.routes').then(m => m.USUARIO_ROUTES)
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/chat/chat.routes').then(m => m.CHAT_ROUTES)
  },
  { path: '**', redirectTo: '' }
];