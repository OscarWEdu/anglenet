import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('Client');
	protected readonly authService = inject(AuthService);
	isDarkMode = false;

	toggleDarkMode(): void {
		this.isDarkMode = !this.isDarkMode;

		document.documentElement.setAttribute(
			'data-bs-theme',
			this.isDarkMode ? 'dark' : 'light'
		);
	}
}