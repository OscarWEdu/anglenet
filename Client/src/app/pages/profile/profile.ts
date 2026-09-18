import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-profile',
	imports: [],
	templateUrl: './profile.html',
	styleUrl: './profile.scss'
})

export class Profile {
	protected authService = inject(AuthService);
	private router = inject(Router);

	logout() {
		this.authService.logout();
		this.router.navigate(['/home']);
	}
}
