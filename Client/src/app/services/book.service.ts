import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Book {
	id: number;
	title: string;
	imageUrl: string;
	publicationDate: string;
	description: string;
	lastEditedBy: string;
}

export interface BookRequest {
	title: string;
	imageUrl: string;
	publicationDate: string;
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class BookService {
	private http = inject(HttpClient);
	private apiUrl = `${environment.apiUrl}/books`;

	getBooks(search?: string): Observable<Book[]> {
		const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
		return this.http.get<Book[]>(url);
	}

    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateBook(id: number, request: BookRequest): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/${id}`, request);
    }

    createBook(request: BookRequest): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, request);
    }
}
