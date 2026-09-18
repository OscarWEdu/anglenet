import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Quote {
	id: number;
	text: string;
	userId: number;
}

export interface QuoteRequest {
	text: string;
}

@Injectable({
	providedIn: 'root'
})
export class QuoteService {
	private http = inject(HttpClient);

	private readonly apiUrl = `${environment.apiUrl}/quotes`;

	getQuotes(): Observable<Quote[]> {
		return this.http.get<Quote[]>(this.apiUrl);
	}

	createQuote(request: QuoteRequest): Observable<Quote> {
		return this.http.post<Quote>(this.apiUrl, request);
	}

	updateQuote(id: number, request: QuoteRequest): Observable<Quote> {
		return this.http.put<Quote>(`${this.apiUrl}/${id}`, request);
	}

	deleteQuote(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
