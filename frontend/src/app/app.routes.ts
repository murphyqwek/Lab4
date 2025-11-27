import { Routes } from '@angular/router';
import { Credentials } from './components/credentials/credentials';
import { Main } from './components/main/main';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
    { path: 'login', component: Credentials },
    { path: 'register', component: Credentials},

    { 
        path: 'shoot', 
        component: Main, 
        canActivate: [authGuard]
    },
    
    { path: '', redirectTo: '/shoot', pathMatch: 'full' }
];
