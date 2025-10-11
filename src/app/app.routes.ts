import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
        path: 'cadastros',
        loadChildren: () => import('./modules/cadastros/cadastros.routes').then(m => m.CADASTROS_ROUTES)
    }
];
