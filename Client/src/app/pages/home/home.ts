import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService, Book, BookRequest } from './../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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
	editingBook: Book | null = null;
	isEditing = false;
	isCreating = false;

	openBook(book: Book) {
		this.selectedBook = book;
		this.editingBook = null;
		this.isEditing = false;
		this.isCreating = false;
	}

	closeBook() {
		this.selectedBook = null;
		this.editingBook = null;
		this.isEditing = false;
		this.isCreating = false;
	}

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
	
	startEditing() {
		if (!this.selectedBook || !this.authService.currentUser()) {
			return;
		}

		this.editingBook = { ...this.selectedBook };
		this.isEditing = true;
	}

	startCreating() {
		if (!this.authService.currentUser()) {
			return;
		}

		this.selectedBook = null;
		this.editingBook = {
			id: 0,
			title: '',
			imageUrl: '',
			publicationDate: '',
			description: '',
			lastEditedBy: ''
		};
		this.isEditing = true;
		this.isCreating = true;
	}

	cancelEditing() {
		this.editingBook = null;
		this.isEditing = false;
		this.isCreating = false;
	}

	saveBook() {
		if (!this.editingBook || !this.authService.currentUser()) {
			return;
		}

		const request: BookRequest = {
			title: this.editingBook.title,
			imageUrl: this.editingBook.imageUrl,
			publicationDate: this.editingBook.publicationDate,
			description: this.editingBook.description
		};

		if (this.isCreating) {
			this.bookService.createBook(request).subscribe({
				next: () => {
					this.loadBooks();
					this.closeBook();
				},
				error: (error: HttpErrorResponse) => {
					console.error('Failed to create book:', error);
				}
			});

			return;
		}

		this.bookService.updateBook(this.editingBook.id, request).subscribe({
			next: updatedBook => {
				this.selectedBook = updatedBook;
				this.editingBook = null;
				this.isEditing = false;
				this.isCreating = false;
				this.loadBooks();
			},
			error: (error: HttpErrorResponse) => {
				console.error('Failed to update book:', error);
			}
		});
	}


	deleteBook() {
		if (!this.selectedBook) {
			return;
		}

		this.bookService.deleteBook(this.selectedBook.id).subscribe({
			next: () => {
				this.loadBooks();
				this.closeBook();
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
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