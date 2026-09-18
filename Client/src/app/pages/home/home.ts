import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from './../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-home',
	imports: [FormsModule],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home implements OnInit {
	private bookService = inject(BookService);
	protected authService = inject(AuthService);

	selectedBook: Book | null = null;

	openBook(book: Book) { this.selectedBook = book; }
	closeBook() { this.selectedBook = null; }

	protected books: Book[] = [];
	searchTerm = '';

	loadBooks() {
		this.bookService.getBooks().subscribe({
			next: books => {
				this.books = books;
			},
			error: error => {
				console.error('Failed to load books:', error);
			}
		});
	}

	ngOnInit() {
		this.loadBooks();
	}

	get filteredBooks(): Book[] {
		const search = this.searchTerm.trim().toLowerCase();

		if (!search) {
			return this.books;
		}

		return this.books.filter(book =>
			book.title.toLowerCase().includes(search)
		);
	}
}