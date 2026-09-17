import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';

@Component({
	selector: 'app-login',
	imports: [FormsModule],
	templateUrl: './login.html'
})
export class Login {
	private authService = inject(AuthService);

	username = '';
	password = '';
	message = '';

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
}
