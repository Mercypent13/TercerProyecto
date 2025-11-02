import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { Galeria } from './pages/galeria/galeria';
import { Dashboard } from './pages/dashboard/dashboard';
import { AboutUs } from './pages/about-us/about-us';

export const routes: Routes = [
  { 
    path: 'home', 
    component: Home 
  },
  { 
    path: 'inicio-sesion', 
    component: Login
  },
  { 
    path: 'registro', 
    component: SignUp
  },
  { 
    path: 'galeria', 
    component: Galeria 
  },
  { 
    path: 'dashboard', 
    component: Dashboard 
  },
  { 
    path: 'sobre-nosotros', 
    component: AboutUs 
  },
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/home' 
  },
];
