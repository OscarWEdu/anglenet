import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Quotes } from './pages/quotes/quotes';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: Home },
	{ path: 'login', component: Login },
	{ path: 'quotes', component: Quotes }
];
