import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
	selector: 'app-login',
	imports: [FormsModule],
	templateUrl: './login.html'
})
export class Login {
	private authService = inject(AuthService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);

	isRegistering = false;

	username = '';
	password = '';
	message = '';

	constructor() {
		this.route.url.subscribe(segments => {
			this.isRegistering = segments[0]?.path === 'register';
		});
	}

	switchToRegister() {
		this.router.navigate(['/register']);
	}

	switchToLogin() {
		this.router.navigate(['/login']);
	}

	register() {
		this.authService.register({
			username: this.username,
			password: this.password
		}).subscribe({
			next: () => {
				this.message = 'Account created successfully!';
			},
			error: error => {
				console.error(error);
				this.message = error.error ?? 'Registration failed.';
			}
		});
	}

	login() {
		this.authService.login({
			username: this.username,
			password: this.password
		}).subscribe({
			next: () => {
				this.message = 'Logged on successfully!';
			},
			error: error => {
				console.error(error);
				this.message = error.error ?? 'Login failed.';
			}
		});
	}
}
