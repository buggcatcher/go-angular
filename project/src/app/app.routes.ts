import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { About } from './pages/about/about';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '',   loadComponent: (() => Homepage) },
    { path: 'about',   loadComponent: (() => About) },
    { path: 'login',   loadComponent: (() => LoginComponent) },
    { path: 'profile',   loadComponent: (() => ProfileComponent) },
];
