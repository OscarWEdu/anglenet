import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from './../../services/book.service';

@Component({
	selector: 'app-home',
	imports: [FormsModule],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home implements OnInit {
	private bookService = inject(BookService);

	protected books: Book[] = [];
	searchTerm = '';

	ngOnInit() {
		this.bookService.getBooks().subscribe({
			next: books => {
				this.books = books;
			},
			error: error => {
				console.error('Failed to load books:', error);
			}
		});
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