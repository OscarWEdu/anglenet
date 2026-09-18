import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Quote, QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-quotes',
	imports: [],
	templateUrl: './quotes.html',
	styleUrl: './quotes.scss'
})
export class Quotes implements OnInit {
	private quoteService = inject(QuoteService);
	protected authService = inject(AuthService);

	protected quotes: Quote[] = [];

	loadQuotes(): void {
		if (!this.authService.currentUser()) {
			this.quotes = [];
			return;
		}

		this.quoteService.getQuotes().subscribe({
			next: quotes => {
				this.quotes = quotes;
			},
			error: (error: HttpErrorResponse) => {
				console.error('Failed to load quotes:', error);
				this.quotes = [];
			}
		});
	}

	ngOnInit(): void {
		this.loadQuotes();
	}
}