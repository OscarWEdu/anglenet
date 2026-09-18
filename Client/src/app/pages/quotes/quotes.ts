import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Quote, QuoteRequest, QuoteService } from '../../services/quote.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-quotes',
	imports: [FormsModule],
	templateUrl: './quotes.html',
	styleUrl: './quotes.scss'
})
export class Quotes implements OnInit {
	private quoteService = inject(QuoteService);
	protected authService = inject(AuthService);

	protected quotes: Quote[] = [];

	selectedQuote: Quote | null = null;
	editingQuote: Quote | null = null;
	isEditing = false;
	isCreating = false;

	loadQuotes(): void {
		if (!this.authService.currentUser()) {
			this.quotes = [];
			return;
		}

		this.quoteService.getQuotes().subscribe({
			next: quotes => {
				this.quotes = quotes.slice(0, 5);
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

	openQuote(quote: Quote): void {
		this.selectedQuote = quote;
		this.editingQuote = null;
		this.isEditing = false;
		this.isCreating = false;
	}

	closeQuote(): void {
		this.selectedQuote = null;
		this.editingQuote = null;
		this.isEditing = false;
		this.isCreating = false;
	}

	startEditing(): void {
		if (!this.selectedQuote || !this.isOwner(this.selectedQuote)) {
			return;
		}

		this.editingQuote = { ...this.selectedQuote };
		this.isEditing = true;
	}

	startCreating(): void {
		if (!this.authService.currentUser()) {
			return;
		}

		this.selectedQuote = null;
		this.editingQuote = {
			id: 0,
			text: '',
			userId: 0
		};
		this.isEditing = true;
		this.isCreating = true;
	}

	cancelEditing(): void {
		this.editingQuote = null;
		this.isEditing = false;
		this.isCreating = false;
	}

	saveQuote(): void {
		if (!this.editingQuote || !this.authService.currentUser()) {
			return;
		}

		const request: QuoteRequest = {
			text: this.editingQuote.text
		};

		if (this.isCreating) {
			this.quoteService.createQuote(request).subscribe({
				next: () => {
					this.loadQuotes();
					this.closeQuote();
				},
				error: (error: HttpErrorResponse) => {
					console.error('Failed to create quote:', error);
				}
			});

			return;
		}

		this.quoteService.updateQuote(this.editingQuote.id, request).subscribe({
			next: updatedQuote => {
				this.selectedQuote = updatedQuote;
				this.editingQuote = null;
				this.isEditing = false;
				this.isCreating = false;
				this.loadQuotes();
			},
			error: (error: HttpErrorResponse) => {
				console.error('Failed to update quote:', error);
			}
		});
	}

	deleteQuote(): void {
		if (!this.selectedQuote || !this.isOwner(this.selectedQuote)) {
			return;
		}

		this.quoteService.deleteQuote(this.selectedQuote.id).subscribe({
			next: () => {
				this.loadQuotes();
				this.closeQuote();
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
			}
		});
	}

	isOwner(quote: Quote): boolean {
		return this.authService.currentUser()?.id === quote.userId;
	}
}