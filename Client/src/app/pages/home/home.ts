import { Component, OnInit, inject, signal } from '@angular/core';
import { BookService, Book } from './../../services/book.service';

@Component({
	selector: 'app-home',
	imports: [],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home implements OnInit {
	private bookService = inject(BookService);

	protected books: Book[] = [];

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
}