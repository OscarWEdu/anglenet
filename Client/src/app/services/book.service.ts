import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
	id: number;
	title: string;
	imageUrl: string;
	publicationDate: string;
	description: string;
	lastEditedBy: string;
}

@Injectable({
	providedIn: 'root'
})
export class BookService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:5178/api/books';

	getBooks(search?: string): Observable<Book[]> {
		const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
		return this.http.get<Book[]>(url);
	}
}
