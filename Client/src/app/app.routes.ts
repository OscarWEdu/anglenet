import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Quotes } from './pages/quotes/quotes';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: Home },
	{ path: 'login', component: Login },
	{ path: 'register', component: Login },
	{ path: 'profile', component: Profile },
	{ path: 'quotes', component: Quotes }
];
